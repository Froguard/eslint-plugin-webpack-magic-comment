---
name: create-new-eslint-plugin-rule
description: "创建新的 ESLint 插件规则"
overview: "创建新的 ESLint 插件规则，包括规则文件创建、测试用例编写和规则注册。提供完整的代码模板和最佳实践。"
keywords: "创建 ESLint 规则, new eslint rule, add rule"
---

# 创建新的 eslint 插件规则

## 创建步骤
1. 创建规则文件
- 创建规则文件，文件名必须与规则名称一致，例如 `rules/my-rule.js`。
- 规则文件必须包含 `meta` 对象，该对象包含 `type`、`docs`、`fixable`、`schema` 等属性。内容参考如下

```javascript
module.exports = {
  meta: {
    type: 'problem',
    docs: {},
    fixable: 'code',
    schema: []
    //...
  },
  create(context) {
    //...
  }
}

2. 创建测试用例
- 创建测试用例，文件名必须与规则名称一致，例如 `tests/test-cases/my-rule.js`。

3. 添加规则到规则列表
- 在 `lib/rules/index.js` 文件中添加规则导出。例如：`module.exports = { myRule: require('./my-rule') };`。
