// var funnel = require('broccoli-funnel');
var compileStyledown = require('./index');

var styleguideHtml = compileStyledown(['test'], {
  configMd: 'test/config.md'
});

module.exports = styleguideHtml;