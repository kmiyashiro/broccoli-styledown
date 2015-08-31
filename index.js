var fs = require('fs');
var path = require('path');
var RSVP = require('rsvp');
var writeFile = RSVP.denodeify(fs.writeFile);
var readFile = RSVP.denodeify(fs.readFile);
var Minimatch = require('minimatch').Minimatch;
var Styledown = require('styledown');
var walkSync = require('walk-sync');
var Funnel = require('broccoli-funnel');
var CachingWriter = require('broccoli-caching-writer');
var merge = require('lodash.merge');
var debug = require('debug')('broccoli-styledown');

var FS_OPTIONS = { encoding: 'utf8' };
var EXTENSIONS = '(less|css|sass|scss|styl|md)';

function getPath(srcPath, fileName) {
  return path.join(srcPath, fileName);
}

module.exports = CachingWriter.extend({
  enforceSingleInputTree: true,

  init: function(srcTree, destFile, options) {
    var opts = merge({}, options, {
      filterFromCache: {
        include: [new RegExp('\.' + EXTENSIONS + '$')],
      }
    });

    this.destFile = destFile || 'index.html';
    debug('destFile', this.destFile);

    this.srcTree = srcTree;
    debug('srcTrees', srcTree);

    return this._super(srcTree, opts);
  },

  updateCache: function(srcPath, destDir) {
    debug('updateCache', srcPath);

    var styledownOpts = this.styledown || {};
    var destFile = this.destFile;

    return this.getSourceFileData(srcPath).then(function(srcData) {
      var html = Styledown.parse(srcData, styledownOpts);

      return writeFile(path.join(destDir, destFile), html, FS_OPTIONS);
    })
    .catch(function(err) {
      debug(err);
    });
  },

  /**
   * Get all data for files in srcPath.
   *
   * @param {String} srcPath Path to read for files
   * @return {Promise} Array of all files [{ name: 'fileName', data: String }]
   */
  getSourceFileData: function(srcPath) {
    debug('srcPath', srcPath);

    var filePaths = walkSync(srcPath).filter(function(fileName) {
      if (fileName.charAt(fileName.length - 1) === '/') {
        return false;
      }

      return true;
    });

    debug('filePaths', filePaths);

    var readPromises = filePaths.map(function(filePath) {
      return readFile(getPath(srcPath, filePath), FS_OPTIONS)
        .then(function(data) {
          return { name: filePath, data: data };
        });
    });

    return RSVP.all(readPromises)
      .catch(function(err) {
        console.log('Error reading source file data');
        console.error(err);
      });
  },
});
