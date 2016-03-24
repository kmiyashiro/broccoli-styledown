var StyledownWriter = require('./index');

var styleguideHtml = new StyledownWriter(['test'], {
  configMd: 'test/config.md'
});

module.exports = styleguideHtml;
