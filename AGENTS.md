# Project Rules (通用)

## 项目概述

这是一个 ESLint 插件，用于检查和自动修复 Webpack 魔法注释的格式错误。主要检测将 `/* ... */` 错误地写成 `/** ... */` 或 `/*** ... */` 的情况。

## 技术栈

- Node.js 8+
- JavaScript (ES2015+)
- ESLint 4.18.2+
- 测试框架： Mocha
- 包管理器： npm，发布到 npm

## 项目结构

```text
 ./
  ├ index.js                  # 主入口文件
  ├ lib /
  │  └ rules /                # 存放规则的文件夹
  │     └ comment.js          # 规则文件
  ├ package.json              # 项目信息
  └ tests /
     ├ index.js               # 测试入口文件（尽量不动这个，一般不用更改）
     └ test-cases /           # 存放测试用例的文件夹
        └ comment.js          # 测试用例
```

## 常用命令
- `npm test` - 运行所有单元测试（使用 Mocha，自动加载 `tests/test-cases/` 下所有测试用例并匹配到对应的规则）

## 代码架构

### 插件结构流程

```
index.js (主入口)
  ↓ 导出 rules 对象
lib/rules/comment.js (规则定义)
  ↓
tests/index.js (测试入口，使用 requireindex 动态加载)
  ↓
tests/test-cases/comment.js (测试用例)
```

### 关键设计模式

1. **动态测试加载**：测试入口使用 `requireindex` 自动遍历 `tests/test-cases/` 目录，将测试文件与规则名称自动匹配。例如 `comment.js` 测试文件会自动查找 `rules['comment']`。

2. **规则实现模式**：
   - 必须包含 `meta` 对象（type, docs, fixable, schema, messages）
   - `create` 函数返回 AST 遍历器
   - 使用 `context.getSourceCode()` 获取源码
   - `fixable: 'code'` 表示支持自动修复
   - 错误消息通过 `messageId` 引用，测试时需保持与 `meta.messages` 一致

3. **检测逻辑**：
   - 监听 `ImportExpression`（`import()` 语法）
   - 监听 `CallExpression`（转换后的 `Import()` 调用）
   - 检测关键字：`webpackChunkName`、`webpackPrefetch`、`webpackPreload`、`webpackMode`、`webpackIgnore`
   - 使用正则验证注释格式：`/^\/\*[^*]/` 和 `/[^*]\*\/$/`

### 测试用例结构

- `valid` 数组：符合规则的代码示例
- `invalid` 数组：违反规则的代码，需包含 `errors` 和可选的 `output`（自动修复后的代码）
- 重要：`errors` 的 `message` 必须与规则的 `meta.messages` 中的值完全一致

## 代码风格

- 使用 ESLint 推荐的规则（通过 `@eslint/js` 或 `eslint:recommended`）
- 所有规则必须包含：
  - `meta` 对象（type, docs, fixable, schema）
  - `create` 函数
- 优先使用 `context.getSourceCode()` 而非直接解析 AST
- 测试用例使用 `RuleTester` (ESLint 内置)
- 使用 CommonJS 模块系统

## AI 行为约束

- 生成新规则时，必须同时生成对应的测试文件，测试文件夹为 `tests/test-cases/`，测试文件名和规则文件保持一致
- 规则名称采用 kebab-case，文件名与规则名一致
- 禁止使用 `console.log` 输出调试信息，应使用 `context.report` 或日志模块
- 关键逻辑代码需要写出中文注释，且所有导出的 API 必须包含 JSDoc 注释