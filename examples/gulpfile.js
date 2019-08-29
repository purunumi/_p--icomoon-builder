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
    let fontName, icomoonZipFile, preProcessorPath, cssPath, fontPath, docsPath, ligaPath, minifyCss;

    fontName = 'glyphicon';
    icommonZipFile = path.resolve('test.zip');
    preProcessorPath = path.resolve('./src/scss/base/fonts/glyphicon');
    cssPath = path.resolve('./src/css');
    fontPath = path.resolve('./src/fonts/glyphicon');
    docsPath = path.resolve('./src/docs');
    ligaPath = path.resolve('./src/js/liga');
    minifyCss = 'Y';

    cp.fork(path.resolve('../lib/builder'), ['export', fontName, icommonZipFile, preProcessorPath, cssPath, fontPath, docsPath, ligaPath])
}

function watch(){
    //
}

exports.watch = watch;
// exports.default = gulp.series(serve, gulp.parallel(watch));
exports.glyphicon = glyphicon;

exports.default = serve;