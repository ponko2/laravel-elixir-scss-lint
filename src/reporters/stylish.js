const gutil         = require('gulp-util');
const stringLength  = require('string-length');
const table         = require('text-table');
const map           = require('map-stream');
const pluralize     = require('pluralize');
const colors        = gutil.colors;
const errorSymbol   = colors.red('✖');
const warningSymbol = colors.yellow('⚠');
const isWin         = process.platform === 'win32';

module.exports = function () {
  return map((files, cb) => {
    files.forEach((file) => {
      const headers = [];

      let output       = '';
      let prevFile     = '';
      let errorCount   = 0;
      let warningCount = 0;

      if (file.scsslint.success) {
        return;
      }

      // eslint-disable-next-line prefer-template
      output += table(file.scsslint.issues.map((issue, index) => {
        const isError = issue.severity !== 'warning';

        const line = ['', colors.gray(`line ${issue.line}`)];

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
      }), {stringLength}).split('\n').map((value, index) => {
        if (headers[index]) {
          return `\n${colors.underline(headers[index])}\n${value}`;
        }

        return value;
      })
        .join('\n') + '\n\n';

      if (errorCount > 0) {
        output += `  ${errorSymbol}  `;
        output += errorCount + pluralize(' error', errorCount);
        output += (warningCount > 0 ? '\n' : '');
      }

      output += `  ${warningSymbol}  `;
      output += warningCount + pluralize(' warning', warningCount);

      gutil.log(`${output}\n`);
    });

    cb(null, files);
  });
};
