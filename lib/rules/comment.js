/**
 * @fileoverview 检查Webpack魔法注释中误将 /* 写成 /** * / 的情况
 * @author froguard
 */

/**
 * 检测文本中是否包含 Webpack 魔法注释关键字（格式：key: value）
 * @param {string} text - 要检测的文本
 * @returns {boolean} - 如果包含 Webpack 魔法注释关键字则返回 true，否则返回 false
 */
function detectMagicComment(text) {
  const magicCommentKeywords = [
    'webpackChunkName',
    'webpackPrefetch',
    'webpackPreload',
    'webpackMode',
    'webpackIgnore',
  ];

  // 使用正则表达式匹配 key: value 格式，其中 key 为 magicCommentKeywords 中的元素
  // 使用单词边界 \\b 确保关键字独立匹配，避免误匹配（如 randomwebpackChunkName）
  const pattern = new RegExp(`\\b(?:${magicCommentKeywords.join('|')})\\b\\s*:`);
  return pattern.test(text);
}

// exports
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow using block comments (/** */) as Webpack magic comments in dynamic imports',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      incorrectComment: 'Webpack magic comments should use /* */ instead of /** */ or /*** */, otherwise it will cause a compilation warning: "Unexpected token"',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    // 检查 import 动态引入时候，对应注释是否为错误的 Webpack 魔法注释
    function checkComment(comment, node) {
      if (comment.type === 'Block') {
        if (detectMagicComment(comment.value)) {
          // 获取完整的注释文本（包括注释标记）
          const fullCommentText = sourceCode.getText().slice(comment.range[0], comment.range[1]);    
          // 检查注释格式是否正确
          // 正确的格式应该是 /* ... */，不能是 /** ... */ 或 /* ... **/ 等
          // 使用更准确的正则表达式来检测
          const startsCorrectly = /^\/\*[^*]/.test(fullCommentText); // 应以 /* 开头且后面不紧跟 *
          const endsCorrectly = /[^*]\*\/$/.test(fullCommentText);   // 应以 */ 结尾且前面不紧跟 *
          const isIncorrectFormat = !startsCorrectly || !endsCorrectly;
          if (isIncorrectFormat) {
            context.report({
              node,
              messageId: 'incorrectComment',
              loc: comment.loc,
              fix(fixer) {
                // 自动修复：将 /** 或 /*** 替换为 /*
                const range = comment.range;
                const text = sourceCode.getText().slice(range[0], range[1]);
                // 处理多种错误格式：
                // /** comment */ -> /* comment */
                // /** comment ***/ -> /* comment */
                // /*** comment */ -> /* comment */
                const fixedText = text
                  .replace(/^\/\*{2,}/, '/*') // 修复开头
                  .replace(/\*{2,}\/$/, '*/'); // 修复结尾
                return fixer.replaceTextRange(range, fixedText);
              },
            });
          }
        }
      }
    }

    return {
      // 处理动态导入语法
      ImportExpression(node) {
        const comments = sourceCode.getCommentsBefore(node.source);
        comments.forEach((comment) => {
          checkComment(comment, node);
        });
      },

      // 处理常规调用表达式形式的动态导入（某些转换器可能会转换语法）
      CallExpression(node) {
        if (node.callee.type === 'Import' && node.arguments.length > 0) {
          const comments = sourceCode.getCommentsBefore(node.arguments[0]);
          comments.forEach((comment) => {
            checkComment(comment, node);
          });
        }
      },

      // TODO: 非动态引入时候的注释，即：不小心把魔法注释写到了 import 语句之外
      // 这里注意，只检查 import 语句紧挨着的上几条注释，其是否是魔法注释
    };
  },
};