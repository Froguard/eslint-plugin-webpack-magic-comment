# eslint-plugin-webpack-magic-comment

ESLint plugin to check Webpack magic comments format

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-webpack-magic-comment`:

```
$ npm install eslint-plugin-webpack-magic-comment --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-webpack-magic-comment` globally.

## Usage

Add `webpack-magic-comment` to the plugins section of your `.eslintrc.js` configuration file. You can omit the `eslint-plugin-` prefix:

```js
module.exports = {
    // ...
    "plugins": [
        "webpack-magic-comment"
    ]
    // ...
};
```

Then configure the rules you want to use under the rules section.

```js
module.exports = {
  // ...
  "rules": {
    "webpack-magic-comment/comment": "error"
  }
  // ...
};
```

This rule will check for incorrect Webpack magic comment formats in dynamic imports, specifically detecting when `/** */` or `/*** */` are used instead of the correct `/* */` format.

### Valid Examples

```js
// ✓ Correct usage - magic comment inside import()
import(/* webpackChunkName: "my-chunk" */ './module');
import(/* webpackPrefetch: true */ './module');
import(/* webpackPreload: true */ './module');

// ✓ Magic comment and import separated by other code
/* webpackChunkName: "my-chunk" */
console.log("hello");
import('./module');

// ✓ Non-magic comments before import
/* just a normal comment */
import('./module');

// ✓ Multi-line comment before import
/*
 * some description
 */
import('./module');
```

### Invalid Examples

```js
// ✘ Incorrect comment format inside import()
import(/** webpackChunkName: "my-chunk" */ './module');
import(/** webpackPrefetch: true */ './module');
import(/*** webpackPreload: true ***/ './module');

// ✘ Magic comment outside import() parentheses
/* webpackChunkName: "my-chunk" */ import('./module');

// ✘ Magic comment with blank line before import
/* webpackChunkName: "my-chunk" */
import('./module');

// ✘ Magic comment with multiple blank lines
/* webpackChunkName: "my-chunk" */


import('./module');
```

The plugin will automatically fix these issues:
- Convert incorrect comment formats (`/** */` → `/* */`)
- Move external magic comments inside `import()` parentheses

### Test

```sh
webpack-magic-comment
    valid
      ✓ import(/* webpackChunkName: "my-chunk" */ './module');
      ✓ import(/* webpackPrefetch: true */ './module');
      ✓ import(/* webpackPreload: true */ './module');
      ✓ import(/* webpackMode: "lazy" */ './module');
    invalid
      ✓ import(/** webpackChunkName: "my-chunk" */ './module');
      ✓ import(/** webpackPrefetch: true */ './module');
      ✓ import(/*** webpackPreload: true ***/ './module');
      ✓ import(/** webpackMode: "lazy" */ './module');
```

### Supported Magic Comments

The plugin detects the following Webpack magic comments:
- `webpackChunkName`
- `webpackPrefetch`
- `webpackPreload`
- `webpackMode`
- `webpackIgnore`

### Auto-fixable

This rule provides auto-fix functionality that will automatically convert incorrect comment formats:
- `/** comment */` → `/* comment */`
- `/*** comment */` → `/* comment */`
- `/** comment ***/` → `/* comment */`

> Created with ESLint rule generator tools.