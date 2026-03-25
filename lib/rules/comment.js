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
      wrongPlacementComment: 'Webpack magic comments should be placed inside the import() parentheses, not before it. Use: import(/* webpackXxx: "Xxx" */"./file")'
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

    /**
     * 检测指定位置之前的注释是否是无效的外部魔法注释
     * 即魔法注释写在了 import 语句括号外，中间只可能有换行或空格
     * @param {ASTNode} node - 节点
     * @param {Comment} comment - 注释对象
     * @returns {boolean} - 如果是无效的外部魔法注释则返回 true
     */
    function checkInvalidExternalMagicComment(node, comment) {
      if (!detectMagicComment(comment.value)) {
        return false;
      }

      // 检查注释是否在 import 语句之前，且中间只有空行或空格
      // 获取注释结束位置和节点开始位置之间的文本
      const commentEnd = comment.range[1];
      const nodeStart = node.range[0];
      const textBetween = sourceCode.getText().slice(commentEnd, nodeStart);

      // 检查中间是否有其他代码语句（非空白字符）
      const hasOtherCode = /\S/.test(textBetween);

      if (!hasOtherCode) {
        // 中间只有空行或空格，说明魔法注释被写在了 import 语句括号外
        context.report({
          node,
          messageId: 'wrongPlacementComment',
          loc: comment.loc,
          fix(fixer) {
            // 自动修复：将注释移动到 import() 内部
            const range = comment.range;
            const text = sourceCode.getText().slice(range[0], range[1]);
            // 移除开头多余星号，转换为内部注释格式
            const innerComment = text
              .replace(/^\/\*\*/, '/*') // 确保是单星号开头
              .replace(/\*\*\//g, '*/') // 确保是单星号结尾
              .trim();
            // 删除外部注释及其后面的空白字符，直到遇到 import 语句
            const removeRange = [range[0], node.range[0]];
            const removeFix = fixer.removeRange(removeRange);
            // 在 import() 后、参数前插入注释
            const insertFix = fixer.insertTextBefore(node.source, `${innerComment} `);
            return [removeFix, insertFix];
          },
        });
        return true;
      }

      return false;
    }

    return {
      // 处理动态导入语法
      ImportExpression(node) {
        // 检查 import() 括号内的注释
        const comments = sourceCode.getCommentsBefore(node.source);
        comments.forEach((comment) => {
          checkComment(comment, node);
        });

        // 检查 node 本身之前的注释（即括号外的注释）
        const commentsBeforeNode = sourceCode.getCommentsBefore(node);
        commentsBeforeNode.forEach((comment) => {
          checkInvalidExternalMagicComment(node, comment);
        });
      },

      // 处理常规调用表达式形式的动态导入（某些转换器可能会转换语法）
      CallExpression(node) {
        if (node.callee.type === 'Import' && node.arguments.length > 0) {
          // 检查 import() 括号内的注释
          const comments = sourceCode.getCommentsBefore(node.arguments[0]);
          comments.forEach((comment) => {
            checkComment(comment, node);
          });

          // 检查 node 本身之前的注释（即括号外的注释）
          const commentsBeforeNode = sourceCode.getCommentsBefore(node);
          commentsBeforeNode.forEach((comment) => {
            checkInvalidExternalMagicComment(node, comment);
          });
        }
      },
    };
  },
};