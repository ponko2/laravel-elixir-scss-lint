var gulp          = require('gulp'),
    elixir        = require('laravel-elixir'),
    notify        = require('gulp-notify'),
    scssLint      = require('gulp-scss-lint'),
    gutil         = require('gulp-util'),
    stringLength  = require('string-length'),
    table         = require('text-table'),
    map           = require('map-stream'),
    events        = require('events'),
    _             = require('underscore'),
    colors        = gutil.colors,
    errorSymbol   = colors.red('✖'),
    warningSymbol = colors.yellow('⚠'),
    emitter       = new events.EventEmitter(),
    PluginError   = gutil.PluginError,
    isWin         = process.platform === 'win32';

function pluralize(str, count) {
  return str + (count === 1 ? '' : 's');
}

var stylishReporter = function () {
  return map(function (files, cb) {
    _.each(files, function (file) {
      var output = '',
        headers = [],
        prevFile = '',
        errorCount = 0,
        warningCount = 0;

      if (file.scsslint.success) {
        return;
      }

      output += table(file.scsslint.issues.map(function (issue, index) {
        var isError = issue.severity !== 'warning';

        var line = [
          '',
          colors.gray('line ' + issue.line),
          isError ? colors.red(issue.reason) : (!isWin ? colors.blue(issue.reason) : colors.cyan(issue.reason))
        ];

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
      }).split('\n').map(function (value, index) {
        return headers[index] ? '\n' + colors.underline(headers[index]) + '\n' + value : value;
      }).join('\n') + '\n\n';

      if (errorCount > 0) {
        output += '  ' + errorSymbol + '  ' + errorCount + pluralize(' error', errorCount) + (warningCount > 0 ? '\n' : '');
      }

      output += '  ' + warningSymbol + '  ' + warningCount + pluralize(' warning', warningCount);

      console.log(output + '\n');
    });

    cb(null, files);
  });
};

var failReporter = function () {
  return map(function (files, cb) {
    var errors = _.filter(files, function (file) {
      return !file.scsslint.success;
    });

    if (errors.length > 0) {
      var fails = _.map(errors, function (file) {
        return file.path;
      });

      var message = 'SCSS-Lint failed for: ' + fails.join(', ');

      emitter.emit('error', new PluginError('scss-lint', message));
    }

    cb(null, files);
  });
};

elixir.extend("scssLint", function (src, options) {
  var config  = this,
      baseDir = config.assetsDir + 'sass';

  src     = src || baseDir + '/**/*.scss';
  options = _.extend({customReport: function () {}}, options);

  var onError = function (err) {
    notify.onError({
      title: "Laravel Elixir",
      subtitle: "SCSS-Lint failed.",
      message: "<%= error.message %>",
      icon: __dirname + '/../laravel-elixir/icons/fail.png'
    })(err);

    this.emit('end');
  };

  gulp.task("scss-lint", function () {
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
        icon: __dirname + '/../laravel-elixir/icons/pass.png'
      }));
  });

  this.registerWatcher("scss-lint", src);

  return this.queueTask("scss-lint");
});
