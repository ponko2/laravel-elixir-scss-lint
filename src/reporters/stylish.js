'use strict';

var gutil         = require('gulp-util');
var stringLength  = require('string-length');
var table         = require('text-table');
var map           = require('map-stream');
var pluralize     = require('pluralize');
var colors        = gutil.colors;
var errorSymbol   = colors.red('✖');
var warningSymbol = colors.yellow('⚠');
var isWin         = process.platform === 'win32';

module.exports = function () {
  return map(function (files, cb) {
    files.forEach(function (file) {
      var output       = '';
      var headers      = [];
      var prevFile     = '';
      var errorCount   = 0;
      var warningCount = 0;

      if (file.scsslint.success) {
        return;
      }

      output += table(file.scsslint.issues.map(function (issue, index) {
        var isError = issue.severity !== 'warning';

        var line = ['', colors.gray('line ' + issue.line)];

        if (isError) {
          line.push(colors.red(issue.reason));
        } else if (!isWin) {
          line.push(colors.blue(issue.reason));
        } else {
          line.push(colors.cyan(issue.reason));
        }

        if (file.path !== prevFile) {
          headers[index] = file.path;
        }

        if (isError) {
          errorCount += 1;
        } else {
          warningCount += 1;
        }

        prevFile = file.path;

        return line;
      }), {stringLength: stringLength}).split('\n').map(function (value, index) {
        if (headers[index]) {
          return '\n' + colors.underline(headers[index]) + '\n' + value;
        }

        return value;
      })
        .join('\n') + '\n\n';

      if (errorCount > 0) {
        output += '  ' + errorSymbol + '  ' +
          errorCount + pluralize(' error', errorCount) +
          (warningCount > 0 ? '\n' : '');
      }

      output += '  ' + warningSymbol + '  ' +
        warningCount + pluralize(' warning', warningCount);

      gutil.log(output + '\n');
    });

    cb(null, files);
  });
};
