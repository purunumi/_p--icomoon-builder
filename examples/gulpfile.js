const cp = require('child_process');
const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const icomoon = require('../lib/export');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

function serve(){
    browserSync.init({
        server: {
            baseDir: './src'
        }
    })
}

function styles(){
    return gulp.src('./src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({grid:'autoplace'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./src/css'));
}

function glyphicon(){
    let fontName, icomoonZipFile, preProcessorPath, cssPath, fontPath, docsPath, ligaPath;

    fontName = 'glyphicon';
    icommonZipFile = path.resolve('icomoon.zip');
    preProcessorPath = path.resolve('./src/scss/base/fonts/glyphicon');
    cssPath = path.resolve('./src/css');
    fontPath = path.resolve('./src/fonts/glyphicon');
    docsPath = path.resolve('./src/docs');
    ligaPath = path.resolve('./src/js/liga');

    cp.fork(path.resolve('../lib/builder'), ['export', fontName, icommonZipFile, preProcessorPath, cssPath, fontPath, docsPath, ligaPath])
}

function watch(){
    gulp.watch('./src/scss/**/*.scss', styles);
}

exports.watch = watch;
exports.glyphicon = glyphicon;
// exports.build = gulp.series(sprite, images, gulp.parallel(styles, scripts));

exports.default = gulp.series(serve, gulp.parallel(watch));