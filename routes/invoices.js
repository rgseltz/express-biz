const express = require('express');
const db = require('../db');
const router = express.Router();
const ExpressError = require('../expressError');

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
		return res.status(200).json({ invoice: results.rows[0] });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
