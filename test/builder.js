var broccoli = require('broccoli');
var StyledownWriter = require('..');

module.exports = function(inputTrees, options) {
  var styledownCompiler = new StyledownWriter(inputTrees, options);

  return new broccoli.Builder(styledownCompiler);
}
