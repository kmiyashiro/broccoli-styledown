var fs = require('fs');
var path = require('path');
var RSVP = require('rsvp');
var writeFile = RSVP.denodeify(fs.writeFile);
var readFile = RSVP.denodeify(fs.readFile);
var Styledown = require('styledown');
var Plugin = require('broccoli-caching-writer');
var walkSync = require('walk-sync');
var merge = require('lodash.merge');
var debug = require('debug')('broccoli-styledown');

var FS_OPTIONS = { encoding: 'utf8' };
var EXTENSIONS = '(less|css|sass|scss|styl)';
var WHITELIST_REGEXP = new RegExp('\.' + EXTENSIONS + '$');
var MD_REGEXP = new RegExp('\.md$');

function getPath(srcPath, fileName) {
  return path.join(srcPath, fileName);
}

function checkFileExists(path) {
  try {
    if (!fs.statSync(path).isFile()) {
      debug('Path is not a file');
      return false;
    }
  } catch(err) {
    debug('File not found', path);
    return false;
  }

  return true;
}

StyledownCompiler.prototype = Object.create(Plugin.prototype);
StyledownCompiler.prototype.constructor = StyledownCompiler;

function StyledownCompiler(inputNodes, options) {
  options = options || {};

  Plugin.call(this, inputNodes, options);

  this.options = options;
  this.configMd = options.configMd || 'config.md';
  this.destFile = options.destFile || 'index.html';
  this.styledown = options.styledown || {};

  debug('inputNodes', inputNodes);
  debug('destFile', this.destFile);
  debug('config', this.configMd);
}

StyledownCompiler.name = 'StyledownCompiler';

StyledownCompiler.prototype.build = function() {
  debug('build');
  debug('inputPaths', this.inputPaths);
  debug('outputPath', this.outputPath);
  debug('cachePath', this.cachePath);

  var styledownOpts = this.styledown || {};
  var destFile = this.destFile;
  var outputPath = this.outputPath;

  var srcDataPromises = this.inputPaths.map(function(inputPath) {
    return this.getSourceFileData(inputPath);
  }, this);

  return RSVP.all(srcDataPromises).then(function(srcDataArrays) {
    // Combine file data arrays from all inputPaths
    var srcData = srcDataArrays.reduce(function(result, srcDataArray) {
      return result.concat(srcDataArray);
    }, []);

    var html = Styledown.parse(srcData, styledownOpts);

    return writeFile(path.join(outputPath, destFile), html, FS_OPTIONS);
  })
  .catch(function(err) {
    debug(err);
  });
};

/**
 * Get all data for files in srcPath.
 *
 * @param {String} srcPath Path to read for files
 * @return {Promise} Array of all files [{ name: 'fileName', data: String }]
 */
StyledownCompiler.prototype.getSourceFileData = function(srcPath) {
  var configMd = this.configMd;
  debug('srcPath', srcPath);

  var filePaths = walkSync(srcPath).filter(function(fileName) {
    if (fileName.match(WHITELIST_REGEXP)) {
      return true;
    }

    return false;
  });

  debug('filter markdown files');
  var filePathsMd = walkSync(srcPath).filter(function(fileName) {
    if (fileName !== configMd && fileName.match(MD_REGEXP)) {
      debug('detected markdown', fileName);
      return true;
    }

    return false;
  });

  // For some reason, Styledown chokes if the md files comes before any
  // of the CSS files
  filePaths = filePaths.concat(filePathsMd);

  // If available, add configMd at the end of the list
  if (configMd) {
    var configPath = getPath(srcPath, configMd);
    var configExists = checkFileExists(configPath);

    if (configExists) {
      debug('Config file found', configPath);
      filePaths = filePaths.concat(configMd);
    }
  }

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
      throw(err);
    });
};

module.exports = StyledownCompiler;
