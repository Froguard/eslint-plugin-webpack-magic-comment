# Project Rules (通用)

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
- `npm test`           运行单元测试

## 代码风格

- 使用 ESLint 推荐的规则（通过 `@eslint/js` 或 `eslint:recommended`）
- 所有规则必须包含：
  - `meta` 对象（type, docs, fixable, schema）
  - `create` 函数
- 优先使用 `context.getSourceCode()` 而非直接解析 AST  
- 测试用例使用 `RuleTester` (ESLint 内置)
- 使用 CommonJS 或 ES modules 需与项目 `package.json` 的 `type` 字段保持一致，默认为 CommonJS

## AI 行为约束

- 生成新规则时，必须同时生成对应的测试文件，测试文件夹为 `tests/test-cases/`，测试文件名和规则文件保持一致
- 规则名称采用 kebab-case，文件名与规则名一致
- 禁止使用 `console.log` 输出调试信息，应使用 `context.report` 或日志模块
- 关键逻辑代码需要写出中文注释，且所有导出的 API 必须包含 JSDoc 注释