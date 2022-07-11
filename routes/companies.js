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
		const companyResults = await db.query(
			`SELECT name, description, industry FROM companies JOIN industries_companies ON companies.code = industries_companies.comp_code JOIN industries ON industries.code = ind_code WHERE companies.code = $1`,
			[ code ]
		);
		const company = companyResults.rows[0];
		const { name } = companyResults.rows[0];
		const { description } = companyResults.rows[0];
		industries = companyResults.rows.map((i) => i.industry);
		console.log(industries);
		console.log(company);
		company.industries = industries;

		res.status(200).json({ company: { name, description, industries } });
	} catch (err) {
		next(err);
	}
});

/** post a single new company */
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

/** edit a single company */
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

/** delete a single company */
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
