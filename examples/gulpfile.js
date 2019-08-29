const cp = require('child_process');
const path = require('path');
const gulp = require('gulp');
const run = require('gulp-run');
// const shell = require('gulp-shell');
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

async function styles(){
    return gulp.src('./src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({grid:'autoplace'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./src/css'));
}

function glyph(){
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

async function watch(){
    //
}

exports.watch = watch;
// exports.default = gulp.series(serve, gulp.parallel(watch));
exports.glyph = glyph;

exports.default = glyph;