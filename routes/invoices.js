const express = require('express');
const db = require('../db');
const router = express.Router();
const ExpressError = require('../expressError');
const todayDate = require('../helper');

/** get all invoices */
router.get('/', async (req, res, next) => {
	try {
		const results = await db.query(`SELECT * FROM invoices;`);
		return res.status(200).json({ invoices: results.rows });
	} catch (err) {
		return next(err);
	}
});

/** get a single invoice*/
router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const results = await db.query(`SELECT * FROM invoices WHERE id=$1;`, [ id ]);
		if (results.rows.length === 0) {
			throw new ExpressError('Could not find invoice id', 404);
		}
		return res.status(200).json({ invoice: results.rows[0] });
	} catch (err) {
		return next(err);
	}
});

/** add a single new invoice*/
router.post('/', async (req, res, next) => {
	try {
		const { comp_code, amt, paid, add_date, paid_date } = req.body;
		results = await db.query(
			`INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[ comp_code, amt, paid, add_date, paid_date ]
		);
		return res.status(201).json({ invoice: results.rows[0] });
	} catch (err) {
		return next(err);
	}
});

/** edit a single invoice */
router.patch('/:id', async (req, res, next) => {
	try {
		let { id } = req.params;
		let { amt, paid, comp_code } = req.body;
		let paidDate = null;

		const currInvoice = await db.query(`SELECT amt, paid, paid_date FROM invoices WHERE id = $1`, [ id ]);
		let currPaidDate = currInvoice.rows[0].paid_date;

		if (!currPaidDate && paid) {
			paidDate = new Date();
		} else if (!paid) {
			paidDate = null;
		} else {
			paidDate = currPaidDate;
		}

		const results = await db.query(
			`UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING id, comp_code, amt, paid, add_date, paid_date`,
			[ amt, paid, paidDate, id ]
		);

		return res.json({ invoice: results.rows[0] });
	} catch (err) {
		return next(err);
	}
});

/** delete a single invoice */
router.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const results = await db.query(`DELETE FROM invoices WHERE id=$1;`, [ id ]);
		return res.json({ msg: 'DELETED' });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
