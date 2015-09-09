'use strict';

var gulp          = require('gulp');
var elixir        = require('laravel-elixir');
var Task          = elixir.Task;
var notify        = require('gulp-notify');
var scssLint      = require('gulp-scss-lint');
var gutil         = require('gulp-util');
var stringLength  = require('string-length');
var table         = require('text-table');
var map           = require('map-stream');
var events        = require('events');
var _             = require('underscore');
var path          = require('path');
var colors        = gutil.colors;
var errorSymbol   = colors.red('✖');
var warningSymbol = colors.yellow('⚠');
var emitter       = new events.EventEmitter();
var PluginError   = gutil.PluginError;
var isWin         = process.platform === 'win32';

function pluralize(str, count) {
  return str + (count === 1 ? '' : 's');
}

var stylishReporter = function() {
  return map(function(files, cb) {
    _.each(files, function(file) {
      var output       = '';
      var headers      = [];
      var prevFile     = '';
      var errorCount   = 0;
      var warningCount = 0;

      if (file.scsslint.success) {
        return;
      }

      output += table(file.scsslint.issues.map(function(issue, index) {
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
          errorCount++;
        } else {
          warningCount++;
        }

        prevFile = file.path;

        return line;
      }), {
        stringLength: stringLength
      }).split('\n').map(function(value, index) {
        if (headers[index]) {
          return '\n' + colors.underline(headers[index]) + '\n' + value;
        }

        return value;
      }).join('\n') + '\n\n';

      if (errorCount > 0) {
        output += '  ' + errorSymbol + '  ' +
          errorCount + pluralize(' error', errorCount) +
          (warningCount > 0 ? '\n' : '');
      }

      output += '  ' + warningSymbol + '  ' +
        warningCount + pluralize(' warning', warningCount);

      console.log(output + '\n');
    });

    cb(null, files);
  });
};

var failReporter = function() {
  return map(function(files, cb) {
    var errors = _.filter(files, function(file) {
      return !file.scsslint.success;
    });

    if (errors.length > 0) {
      var fails = _.map(errors, function(file) {
        return file.path;
      });

      var message = 'SCSS-Lint failed for: ' + fails.join(', ');

      emitter.emit('error', new PluginError('scss-lint', message));
    }

    cb(null, files);
  });
};

elixir.extend('scssLint', function(src, options) {
  var baseDir = this.assetsDir + 'sass';

  src = src || baseDir + '/**/*.scss';

  options = _.extend({customReport: function() {}}, options);

  var onError = function(err) {
    notify.onError({
      title: 'Laravel Elixir',
      subtitle: 'SCSS-Lint failed.',
      message: '<%= error.message %>',
      icon: path.join(__dirname, '../laravel-elixir/icons/fail.png')
    })(err);

    this.emit('end');
  };

  new Task('scss-lint', function() {
    return gulp.src(src)
      .pipe(scssLint(options))
      .pipe(gutil.buffer())
      .pipe(stylishReporter())
      .pipe(failReporter())
      .on('error', onError)
      .pipe(notify({
        title: 'Laravel Elixir',
        subtitle: 'SCSS-Lint passed.',
        message: ' ',
        icon: path.join(__dirname, '../laravel-elixir/icons/pass.png')
      }));
  })
  .watch(src);
});
