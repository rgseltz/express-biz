const express = require('express');
const db = require('../db');
const router = express.Router();
const ExpressError = require('../expressError');

/** gets all companies */
router.get('/', async (req, res, next) => {
	try {
		const results = await db.query(`SELECT * FROM companies;`);
		return res.status(200).json({ companies: results.rows });
	} catch (err) {
		next(err);
	}
});

/** get a single company */
router.get('/:code', async (req, res, next) => {
	try {
		const { code } = req.params;
		const results = await db.query(`SELECT * FROM companies WHERE code=$1;`, [ code ]);
		res.status(200).json({ company: results.rows[0] });
	} catch (err) {
		next(err);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { code, name, description } = req.body;
		results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *;`, [
			code,
			name,
			description
		]);
		return res.status(201).json({ company: results.rows[0] });
	} catch (err) {
		next(err);
	}
});

router.patch('/:code', async (req, res, next) => {
	try {
		const { code } = req.params;
		const { name, description } = req.body;
		const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *;`, [
			name,
			description,
			code
		]);
		return res.json({ company: results.rows[0] });
	} catch (err) {
		next(err);
	}
});

router.delete('/:code', async (req, res, next) => {
	try {
		const { code } = req.params;
		const results = await db.query(`DELETE FROM companies WHERE code = $1;`, [ code ]);
		console.log(results.rows);
		return res.json({ msg: 'DELETED!' });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
