var broccoli = require('broccoli');
var StyledownWriter = require('..');

module.exports = function(inputTrees) {
  var styledownCompiler = new StyledownWriter(inputTrees);

  return new broccoli.Builder(styledownCompiler).build().then(function(results) {
    return results;
  });
}
