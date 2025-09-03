/**
 * @fileoverview 检查Webpack魔法注释, eg: /* 写成 /** * / 的情况
 * @author froguard
 */
//------------------------------------------------------------------------------
// Test Cases
//------------------------------------------------------------------------------

// eslint.RuleTester is string-compare ,which via error.message, so you must keep same value between errors and errMsg
const { meta } = require('../../lib/rules/webpack-magic-comment')
const errMsg = meta.messages.incorrectComment;
const errors = [{ message: errMsg}];

//
module.exports = {
    valid: [
        {
            code: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")', 
        },
        {
            code: 'import(/* webpackChunkName: "someModule" */ /* webpackPreload: true */ "/a/b/c.js")', 
        },
    ],
    invalid: [
        {
            code: 'import(/** webpackChunkName: "someModule" */ "/a/b/c.js")', 
            errors,
            output: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")',
        },
        {
            code: 'import(/*** webpackChunkName: "someModule" */ "/a/b/c.js")', 
            errors,
            output: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")',
        },
        {
            code: 'import(/* webpackChunkName: "someModule" **/ "/a/b/c.js")', 
            errors,
            output: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")',
        },
        {
            code: 'import(/* webpackChunkName: "someModule" **/ /* webpackPreload: true */ "/a/b/c.js")', 
            errors,
            output: 'import(/* webpackChunkName: "someModule" */ /* webpackPreload: true */ "/a/b/c.js")',
        },
    ]
};