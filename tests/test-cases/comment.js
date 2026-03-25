/**
 * @fileoverview 检查Webpack魔法注释, eg: /* 写成 /** * / 的情况
 * @author froguard
 */
//------------------------------------------------------------------------------
// Test Cases For lib/rules/comment.js
//------------------------------------------------------------------------------

// eslint.RuleTester is string-compare ,which via error.message, so you must keep same value between errors and errMsg
const { meta } = require('../../lib/rules/comment')
const fmtErrMsg = meta.messages.incorrectComment;
const posErrMsg = meta.messages.wrongPlacementComment;
const fmtErrors = [{ message: fmtErrMsg}];
const posErrors = [{ message: posErrMsg }];

//
module.exports = {
    valid: [
        {
            code: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")',
        },
        {
            code: 'import(/* webpackChunkName: "someModule" */ /* webpackPreload: true */ "/a/b/c.js")',
        },
        // 魔法注释和 import 之间有其他代码，不报错
        {
            code: '/* webpackChunkName: "someModule" */ console.log("hello"); import("/a/b/c.js")',
        },
        // 非魔法注释在 import 前面，不报错
        {
            code: '/* just a normal comment */ import("/a/b/c.js")',
        },
        // 多行普通注释在 import 前面，不报错
        {
            code: `/*
             * some description
             */ import("/a/b/c.js")`,
        },
    ],
    invalid: [
        {
            code: 'import(/** webpackChunkName: "someModule" */ "/a/b/c.js")',
            errors: fmtErrors,
            output: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")',
        },
        {
            code: 'import(/*** webpackChunkName: "someModule" */ "/a/b/c.js")',
            errors: fmtErrors,
            output: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")',
        },
        {
            code: 'import(/* webpackChunkName: "someModule" **/ "/a/b/c.js")',
            errors: fmtErrors,
            output: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")',
        },
        {
            code: 'import(/* webpackChunkName: "someModule" **/ /* webpackPreload: true */ "/a/b/c.js")',
            errors: fmtErrors,
            output: 'import(/* webpackChunkName: "someModule" */ /* webpackPreload: true */ "/a/b/c.js")',
        },
        // 魔法注释写在 import 语句括号外
        {
            code: '/* webpackChunkName: "someModule" */ import("/a/b/c.js")',
            errors: posErrors,
            output: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")',
        },
        // 魔法注释和 import 之间有空行
        {
            code: `/* webpackChunkName: "someModule" */
import("/a/b/c.js")`,
            errors: posErrors,
            output: `import(/* webpackChunkName: "someModule" */ "/a/b/c.js")`,
        },
        // 魔法注释和 import 之间有多个空行和空格
        {
            code: `/* webpackChunkName: "someModule" */

import("/a/b/c.js")`,
            errors: posErrors,
            output: `import(/* webpackChunkName: "someModule" */ "/a/b/c.js")`,
        },
        // 错误格式的魔法注释在 import 外
        {
            code: '/** webpackChunkName: "someModule" */ import("/a/b/c.js")',
            errors: posErrors,
            output: 'import(/* webpackChunkName: "someModule" */ "/a/b/c.js")',
        },
    ]
};