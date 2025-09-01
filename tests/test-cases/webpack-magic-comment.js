/**
 * @fileoverview 检查Webpack魔法注释, eg: /* 写成 /** * / 的情况
 * @author froguard
 */
//------------------------------------------------------------------------------
// Test Cases
//------------------------------------------------------------------------------

// eslint.RuleTester is string-compare ,which via error.message, so you must keep same value between errors and errMsg
const errMsg = 'Webpack魔法注释应使用 /* */ 而不是 /** */，否则会导致编译警告: "Unexpected token"';
const errors = [{ message: errMsg}];

//
module.exports = {
    valid: [
        {
            code: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")', // packageName
        },
    ],
    invalid: [
        {
            code: 'import(/** webpackChunkName: "someModule" */ "/a/b/c.js")', // packageName
            errors,
        },
        // {
        //     code: 'import(/*** webpackChunkName: "someModule" */ "/a/b/c")', // packageName
        //     errors,
        // },
    ]
};