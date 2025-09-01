/**
 * @fileoverview limit import source from some special folder in configuration
 * @author froguard
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let webpackMagicComment = require('./lib/rules/webpack-magic-comment');


//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

let rules = {};

module.exports.rules = Object.assign(rules, {
    "webpack-magic-comment": webpackMagicComment
});
