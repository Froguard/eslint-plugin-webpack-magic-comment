/**
 * @fileoverview limit import source from some special folder in configuration
 * @author froguard
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
let requireIndex = require('requireindex');
let rules = require('../index').rules;
let RuleTester = require("eslint").RuleTester;

let ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020, sourceType: 'module' } });
let testCases = requireIndex(`${__dirname}/test-cases`);


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

Object.keys(testCases).forEach((k) => {
    let tc = testCases[k];
    let rule = rules[k];
    if (!rule) {
        let err = `The test-case '${k}.js' is not found the matched rule (rules['${k}'] is ${rule})`;
        console.warn(err);
        throw new Error(err);
    }
    tc && ruleTester.run(k, rules[k], tc);
});
