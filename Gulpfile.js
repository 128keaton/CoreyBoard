const gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify-es').default,
    webpack = require('webpack'),
    log = require('fancy-log'),
    webpackStream = require('webpack-stream'),
    webpackConfig = require('./webpack.config.js'),
    packageInfo = require('./package'),
    watchFiles = function(){
        for (const [task, watchPath] of Object.entries(packageInfo.paths)) {
            log('Created watch task for ' + task);
            gulp.watch(watchPath, gulp.parallel(task));
        }
        log('Watching for changes in: ' + Object.values(packageInfo.paths).join(", "));
        return gulp.series(Object.keys(packageInfo.paths));
    };

gulp.task('lib', function () {
    return gulp.src(packageInfo.paths.lib)
        .pipe(gulp.dest('./dist/lib'));
});

gulp.task('styles', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest("./dist/css"));
});

gulp.task('scripts', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('sounds', function () {
    return gulp.src('src/sounds/**/*.{mp3,m4a,wav}')
        .pipe(gulp.dest('./dist/sounds'));
});


gulp.task('images', function () {
    return gulp.src(packageInfo.paths.images)
        .pipe(gulp.dest('./dist/images'));
});


gulp.task('default', gulp.series(Object.keys(packageInfo.paths)));
gulp.task('watch', gulp.series('default', watchFiles));
