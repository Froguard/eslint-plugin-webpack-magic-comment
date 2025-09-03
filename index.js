/**
 * @fileoverview 检查Webpack魔法注释, eg: /* 写成 /** * / 的情况
 * @author froguard
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let webpackMagicComment = require('./lib/rules/comment');


//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

let rules = {};

module.exports.rules = Object.assign(rules, {
    "comment": webpackMagicComment
});
