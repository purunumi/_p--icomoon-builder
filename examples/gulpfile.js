const path = require('path');
const gulp = require('gulp');
const run = require('gulp-run');
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

function glyph(){
    // node lib/builder export test-font ./examples/test.zip ./test/scss ./test/css ./test/fonts ./test/docs ./test/liga
    // icomoon.exports();

    let fontName, icomoonZipFile, preProcessorPath, cssPath, fontPath, docsPath, ligaPath;

    fontName = 'test-font';
    icommonZipFile = path.resolve('test.zip');
    preProcessorPath = path.resolve('../test/scss');
    cssPath = path.resolve('../test/css');
    fontPath = path.resolve('../test/fonts');
    docsPath = path.resolve('../test/docs');
    ligaPath = path.resolve('../test/liga');

    // Do you want to proceed? // after table
    // minify scss

    // var cmd = new run.Command(
    //     `node ../lib/export export ${fontName} ${icommonZipFile} ${preProcessorPath} ${cssPath} ${fontPath} ${docsPath} ${ligaPath}`
    // );
    // cmd.exec();
    return run(
        `node ${path.resolve('../lib/builder export')} ${fontName} ${icommonZipFile} ${preProcessorPath} ${cssPath} ${fontPath} ${docsPath} ${ligaPath}`
    ).exec();
}

function watch(){
    //
}

exports.watch = watch;
// exports.default = gulp.series(serve, gulp.parallel(watch));
exports.glyph = glyph;
exports.default = glyph;