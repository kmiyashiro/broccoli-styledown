var assert = require('assert');
var path = require('path');
var build = require('./build');
var RSVP = require('rsvp');
var fs = require('fs');
var readFile = RSVP.denodeify(fs.readFile);

function getPath(fileName) {
  return path.join(__dirname, fileName);
}

build('./test')
  .then(function(result) {
    var promises = [
      readFile(getPath('expected/index.html'), { encoding: 'utf8' }),
      readFile(result.directory + '/index.html', { encoding: 'utf8' })
    ];

    return RSVP.all(promises);
  })
  .then(function(results) {
    assert.equal(results[0].trim(), results[1].trim());
  })
  .then(function() {
    this.cleanup();
  });
