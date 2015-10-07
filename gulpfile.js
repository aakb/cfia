var gulp = require('gulp');


// Plugins.
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var sass = require('gulp-sass');

var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');

/**
 * Setting up browsersync.
 * Proxy is the name of the vagrent.
 * Host is the the ip defined in "vagrantfile"
 */
var browserSync = require('browser-sync').create();
browserSync.init({
  proxy: "cfia.vm",
  host: "192.168.50.22"
});

// We only want to process our own non-processed JavaScript files.
var jsPath = ['./sites/all/themes/cfia/js/*.js', '!./sites/all/themes/cfia/js/**/*.min.*'];
var sassPath = './sites/all/themes/cfia/scss/**/*.scss';
var twigPath = './sites/all/themes/cfia/templates/**/*.twig'; //could also be twig files

var buildDir = './sites/all/themes/cfia/js';

/**
 * Run Javascript through JSHint.
 */
gulp.task('jshint', function() {
  return gulp.src(jsPath)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

/**
 * Process SCSS using libsass
 */
gulp.task('sass', function () {
  gulp.src(sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./sites/all/themes/cfia/css'))
  .pipe(browserSync.stream());
});

/**
 * Watch files for changes and run tasks.
 */
gulp.task('watch', function() {
  gulp.watch(jsPath, ['jshint']);
  gulp.watch(sassPath, ['sass']);
  gulp.watch(twigPath).on('change', browserSync.reload);
  gulp.watch(jsPath).on('change',browserSync.reload);
});

/**
 * Watch javascript files for changes.
 */
gulp.task('js-watch', function() {
  gulp.watch(jsPath, ['jshint']);
});

/**
 * Build single app.js file.
 */
gulp.task('buildJs', function () {
  gulp.src(jsPath)
    .pipe(sourcemaps.init())
      .pipe(uglify())
    .pipe(sourcemaps.write('/maps'))
    .pipe(rename({extname: ".min.js"}))
    .pipe(gulp.dest(buildDir))
});

/**
 * Build single app.js file.
 */
gulp.task('assetsJs', function () {
  gulp.src(jsAssets)
    .pipe(concat('assets.js'))
    .pipe(rename({extname: ".min.js"}))
    .pipe(gulp.dest(buildDir))
});


// Tasks to compile sass and watch js file.
gulp.task('default', ['sass', 'watch']);
gulp.task('build', ['buildJs', 'sass']);