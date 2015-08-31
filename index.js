var fs = require('fs');
var path = require('path');
var RSVP = require('rsvp');
var writeFile = RSVP.denodeify(fs.writeFile);
var readFile = RSVP.denodeify(fs.readFile);
var Styledown = require('styledown');
var walkSync = require('walk-sync');
var CachingWriter = require('broccoli-caching-writer');
var merge = require('lodash.merge');
var debug = require('debug')('broccoli-styledown');

var FS_OPTIONS = { encoding: 'utf8' };
var EXTENSIONS = '(less|css|sass|scss|styl)';
var WHITELIST_REGEXP = new RegExp('\.' + EXTENSIONS + '$');
var MD_REGEXP = new RegExp('\.md$')

function getPath(srcPath, fileName) {
  return path.join(srcPath, fileName);
}

module.exports = CachingWriter.extend({
  enforceSingleInputTree: true,

  init: function(srcTree, options) {
    var opts = merge({}, options, {
      filterFromCache: {
        include: [WHITELIST_REGEXP, MD_REGEXP],
      }
    });

    this.destFile = 'index.html';

    this.configMd = 'config.md';

    this.srcTree = srcTree;

    this._super(srcTree, opts);

    debug('srcTrees', srcTree);
    debug('destFile', this.destFile);
    debug('config', this.configMd);
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
      if (fileName.match(WHITELIST_REGEXP)) {
        return true;
      }

      return false;
    });

    debug('filePaths', filePaths);

    var readPromises = filePaths.map(function(filePath) {
      return readFile(getPath(srcPath, filePath), FS_OPTIONS)
        .then(function(data) {
          return { name: filePath, data: data };
        });
    });

    // For some reason, Styledown chokes if the config md comes before any
    // of the CSS files
    if (this.configMd) {
      var configMd = this.configMd;

      readPromises.push(readFile(getPath(__dirname, configMd))
        .then(function(data) {
          return { name: configMd, data: data };
        })
      );
    }

    return RSVP.all(readPromises)
      .catch(function(err) {
        console.log('Error reading source file data');
        console.error(err);
      });
  },
});
