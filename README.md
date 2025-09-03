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
// ✓ Correct usage
import(/* webpackChunkName: "my-chunk" */ './module');
import(/* webpackPrefetch: true */ './module');
import(/* webpackPreload: true */ './module');
```

### Invalid Examples

```js
// ✘ Incorrect usage - will be reported
import(/** webpackChunkName: "my-chunk" */ './module');
import(/** webpackPrefetch: true */ './module');
import(/*** webpackPreload: true ***/ './module');
```

The plugin will automatically fix these issues by converting the incorrect comment formats to the proper `/* */` format.

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