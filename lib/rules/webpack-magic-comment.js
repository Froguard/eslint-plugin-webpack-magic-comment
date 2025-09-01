/**
 * @fileoverview 检查Webpack魔法注释中误将 /* 写成 /** * / 的情况
 * @author froguard
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止在动态导入中使用文档块注释(/** */)作为Webpack魔法注释',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      incorrectComment: 'Webpack魔法注释应使用 /* */ 而不是 /** */ 或 /*** */，否则会导致编译警告: "Unexpected token"',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    
    // 检查注释是否为错误的 Webpack 魔法注释
    function checkComment(comment, node) {
      if (comment.type === 'Block') {
        // 检测常见的Webpack魔法注释标识
        const magicCommentKeywords = [
          'webpackChunkName',
          'webpackPrefetch',
          'webpackPreload',
          'webpackMode',
          'webpackIgnore',
        ];

        const hasMagicComment = magicCommentKeywords.some((keyword) => 
          comment.value.includes(keyword)
        );
        
        // 获取完整的注释文本（包括注释标记）
        const fullCommentText = sourceCode.getText().slice(comment.range[0], comment.range[1]);
        
        // 检查注释格式是否正确
        // 正确的格式应该是 /* ... */，不能是 /** ... */ 或 /* ... **/ 等
        const isIncorrectFormat = !/^\/\*[^*]([\s\S]*?)\*\/$/g.test(fullCommentText);
          
        
        if (hasMagicComment && isIncorrectFormat) {
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
    };
  },
};