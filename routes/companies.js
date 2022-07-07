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

module.exports = router;
