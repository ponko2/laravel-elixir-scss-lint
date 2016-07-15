const scssLint        = require('gulp-scss-lint');
const gutil           = require('gulp-util');
const stylishReporter = require('./reporters/stylish');
const failReporter    = require('./reporters/fail');
const Task            = Elixir.Task;

Elixir.extend('scssLint', (src, options) => {
  const notify = new Elixir.Notification();

  const paths = new Elixir.GulpPaths()
    .src(src || [
      `${Elixir.config.get('assets.css.sass.folder')}/**/*.scss`
    ]);

  const onError = function (err) {
    notify.error(err, 'SCSS-Lint Failed');
    this.emit('end');
  };

  new Task('scss-lint', function () {
    this.log(paths.src);

    return gulp.src(paths.src.path)
      .pipe(scssLint(Object.assign({
        customReport() {
          // do nothing.
        }
      }, options)))
      .pipe(gutil.buffer())
      .pipe(stylishReporter())
      .pipe(failReporter())
      .on('error', onError);
  })
  .watch(paths.src.path);
});
