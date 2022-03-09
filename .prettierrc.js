// https://prettier.io/docs/en/options.html
module.exports = {
  tabWidth: 2, // 指定每个缩进级别的空格数
  semi: true, // 在语句末尾打印分号
  singleQuote: true, // 使用单引号代替双引号
  trailingComma: 'all', // 在多行逗号分隔的句法结构中尽可能打印尾随逗号
  bracketSpacing: true, // 在对象文字中的括号之间打印空格
  bracketSameLine: true, // 将 > 多行 HTML（HTML、JSX、Vue、Angular）元素的 放在最后一行的末尾，而不是单独放在下一行
  arrowParens: 'avoid', // 在唯一的箭头函数参数周围尽可能省略括号
  endOfLine: 'auto', // 行结束
};
