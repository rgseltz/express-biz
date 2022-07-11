const express = require('express');
const db = require('../db');
const router = express.Router();
const ExpressError = require('../expressError');

/** show all industries */
router.get('/', async (req, res, next) => {
	try {
		const results = await db.query(`SELECT code, industry FROM industries`);
		return res.status(200).json(results.rows);
	} catch (err) {
		return next(err);
	}
});

/** get single industry */
router.get('/:code', async (req, res, next) => {
	try {
		const { code } = req.params;
		const results = await db.query(`SELECT code, industry FROM industries WHERE code = $1`, [ code ]);
		return res.status(200).json(results.rows);
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
