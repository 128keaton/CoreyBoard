const gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify-es').default,
    webpack = require('webpack'),
    log = require('fancy-log'),
    webpackStream = require('webpack-stream'),
    webpackConfig = require('./webpack.config.js'),
    packageInfo = require('./package'),
    del = require('del'),
    paths = packageInfo.paths,
    tasks = Object.keys(paths),
    favicon = require('./favicon'),
    watchFiles = function () {
        for (const [task, watchPath] of Object.entries(packageInfo.paths)) {
            log('Created watch task for ' + task);
            gulp.watch(watchPath, gulp.parallel(task));
        }
        log('Watching for changes in: ' + Object.values(packageInfo.paths).join(", "));
        return gulp.series(Object.keys(packageInfo.paths));
    };

let getCleanPaths = function () {
    let cleanPaths = [];
    Object.values(paths).forEach(function (value) {
        cleanPaths.push(value.replace('src', 'digulpst'));
    });

    return cleanPaths;
};

gulp.task('lib', function () {
    return gulp.src(paths.lib)
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

gulp.task('html', function () {
    return gulp.src(packageInfo.paths.html)
        .pipe(gulp.dest('./'));
});

gulp.task('clean', function () {
    return del(getCleanPaths(), {force: true});
});

gulp.task('default', gulp.series(tasks));
gulp.task('build-prod', gulp.series(tasks.concat('generate-favicon', 'inject-favicon-markups')));
gulp.task('watch', gulp.series('default', watchFiles));
