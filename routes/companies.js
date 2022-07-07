const express = require('express');
const db = require('../db');
const router = express.Router();
const ExpressError = require('../expressError');

router.get('/', async (req, res, next) => {
	try {
		const results = await db.query(`SELECT * FROM companies;`);
		return res.status(200).json({ companies: results.rows });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
