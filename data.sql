\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS industries_companies;

CREATE TABLE companies (
    code text PRIMARY KEY ON DELETE CASCADE,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text NOT NULL PRIMARY KEY,
  industry text NOT NULL 
);

CREATE TABLE industries_companies (
  id serial PRIMARY KEY,
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
  ind_code text NOT NULL REFERENCES industries ON DELETE CASCADE 
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
  VALUES ('apple', 100, false, '2020-01-01', null),
         ('apple', 200, false, '2020-01-01', null),
         ('apple', 300, true, '2017-12-22','2018-01-01'),
         ('ibm', 400, false, '2020-01-01', null);

INSERT INTO industries (code, industry) 
VALUES 
('acct', 'Accounting'), 
('fin', 'Finance'),
('pr', 'Public Relations'),
('hr', 'Human Resources'),
('mkt', 'Marketing');

INSERT INTO industries_companies (comp_code, ind_code) 
VALUES 
('apple', 'acct'),
('apple', 'pr'),
('apple', 'mkt'),
('ibm', 'acct'),
('ibm', 'fin'),
('ibm', 'hr');