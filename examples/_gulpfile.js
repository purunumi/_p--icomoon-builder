const gulp = require('gulp');
// const plugins = require('gulp-load-plugins')();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const run = require('gulp-run');
const cssVersioner = require('gulp-css-url-versioner');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const pug = require('gulp-pug');
// const babel = require('gulp-babel');
// const concat = require('gulp-concat');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const merge = require('merge-stream');
const { getInstalledPathSync } = require('get-installed-path');

const browserSync = require('browser-sync').create();

const path = require('path');
const fs = require('fs-extra');
const unzip = require('gulp-unzip');
const replace = require('replace-in-file');

sass.compiler = require('node-sass');

function docs(){
    let views = gulp.src('./src/_pub/**/[^_]*.pug')
        .pipe(pug({
            basedir: './src',
            pretty: true,
        }))
        .pipe(gulp.dest('./public/_pub'));

    let styles = gulp.src('./src/_pub/_docs/_css/**/*.css')
        .pipe(gulp.dest('./public/_pub/_docs/_css'));

    let scripts = gulp.src('./src/_pub/_docs/_js/**/*.*')
        .pipe(gulp.dest('./public/_pub/_docs/_js'));

    let images = gulp.src('./src/_pub/_docs/_img/**/*.*')
        .pipe(gulp.dest('./public/_pub/_docs/_img'));

    let examples = gulp.src('./src/_pub/doc/examples/**/*.*')
        .pipe(gulp.dest('./public/_pub/doc/examples'));

    return merge(views, styles, scripts, images, examples);
}
function docsStyles(){
    return gulp.src('./src/_pub/_docs/_css/docs.scss')
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({grid:'autoplace'}))
        .pipe(cssVersioner({lastcommit: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./public/_pub/_docs/_css'));
}

function styles(){
    return gulp.src('./src/scss/conects.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({grid:'autoplace'}))
        .pipe(cssVersioner({lastcommit: true}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./public/css'));
}

// function scripts(){
//     return gulp.src([
//         './src/js/vendors/jquery.magnific-popup.min.js',
//         './src/js/components/st_conects-gnb.js'
//     ])
//         .pipe(sourcemaps.init())
//         .pipe(babel({
//             presets: [
//                 '@babel/preset-react',
//                 '@babel/preset-env',
//             ],
//             compact: true,
//             minified: true,
//             comments: false,
//         }))
//         .pipe(concat('st_conects-gnb.js'))
//         .pipe(sourcemaps.write('./maps'))
//         .pipe(gulp.dest('./public/js'));
// }

function images(){
    return gulp.src([

    ])
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'))
}

function fonts(){
    // let cmd = new run.Command('node ' + getInstalledPathSync('icomoon-builder', { local: true }) + ' export Material-Icons ./src/_pub/docs/icomoon/Material-Icons.zip ./src/scss/base/fonts/Material-Icons ./src/_pub/docs/icomoon/css ./src/fonts/Material-Icons ./src/_pub/docs/icomoon');
    // cmd.exec('Y');

    // let font = fontLigatures.loadFile('./src/fonts/Material-Icons');
    // console.log(font.findLigatures('&#xe900'));

    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./public/fonts'))
}

function glyph(){
    // https://github.com/nass600/icomoon-builder/blob/master/src/commands/export.js
    // https://www.npmjs.com/package/replace-in-file
    // https://www.npmjs.com/package/fs-extra

    let TEMP_DIR = './src/_pub/glyph/.temp';

    let files = [];
    console.log(path.resolve(TEMP_DIR, 'fonts'));

    // docs
    replace({
        files: `${TEMP_DIR}/demo.html`,
        from: [
            'href="demo-files/demo.css"',
            'href="style.css"',
            'src="liga.js"',
            'src="demo-files/demo.js"'
        ],
        to: [
            'href="./css/demo.css"',
            'href="./css/style.css"',
            'src="/js/liga.js"',
            'src="./js/demo.js"'
        ]
    });
    files.push({
        src: `${TEMP_DIR}/demo.html`,
        dest: './src/_pub/_docs/glyph/demo.html'
    }, {
        src: `${TEMP_DIR}/demo-files/demo.css`,
        dest: './src/_pub/_docs/glyph/css/demo.css'
    }, {
        src: `${TEMP_DIR}/style.css`,
        dest: './src/_pub/_docs/glyph/css/style.css'
    }, {
        src: `${TEMP_DIR}/liga.js`,
        dest: './src/js/liga.js'
    }, {
        src: `${TEMP_DIR}/demo-files/demo.js`,
        dest: './src/_pub/_docs/glyph/js/demo.js'
    });

    // scss
    replace({
        files: `${TEMP_DIR}/variables.scss`,
        from: '$icomoon-font-path: "fonts" !default;',
        to: '$icomoon-font-path: "/fonts/glyph" !default;'
    });
    files.push({
        src: `${TEMP_DIR}/variables.scss`,
        dest: './src/scss/base/fonts/glyph/variables.scss'
    },{
        src: `${TEMP_DIR}/style.scss`,
        dest: './src/scss/base/fonts/glyph/style.scss'
    });

    // fonts
    fs.readdirSync(TEMP_DIR + '/fonts/').map((file) => {
        files.push({
            src: `${TEMP_DIR}/fonts/${file}`,
            dest: `./src/fonts/glyph/${file}`
        });
    });

    // gulp.src('./src/_pub/_docs/glyph/glyph.zip')
    //     .pipe(unzip())
    //     .pipe(gulp.dest('./src/_pub/_docs/glyph/.temp'))

    files.map(item => {
        fs.copy(item.src, item.dest);
    });
}

function sprite(){
    let spriteData = gulp.src('./src/img/sprites/*.png')
        .pipe(spritesmith({
            imgName:'sprite.png',
            cssName:'sprite.scss'
        }));

    let imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img/sprites'));

    let cssStream = spriteData.css
        .pipe(gulp.dest('./src/sass/utils'));


    return merge(imgStream, cssStream);
}

function watch(){
    gulp.watch([
        './src/img/**/*',
        '!./src/img/{sprites, sprites/**}/*'
    ], images);
    gulp.watch(['./src/scss/**/*.scss', './src/_pub/_docs/_css/*.scss'], gulp.series(styles, docsStyles));
    // gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./src/img/sprites/*.png', sprite);
    gulp.watch('./src/fonts/**/*', fonts);

    gulp.watch('./src/_pub/**/*.*', docs);
}

exports.docs = docs;
exports.styles = styles;
exports.fonts = fonts;
exports.glyph = glyph;
// exports.scripts = scripts;
exports.watch = watch;
// exports.build = gulp.series(sprite, images, gulp.parallel(styles, scripts));
exports.build = gulp.series(sprite, images, fonts, gulp.parallel(styles));

exports.default = watch;

/*
- gulp 4.0.2로 업데이트
- 그에 따라 설정 간소화
- grid autoprefixer autoplace 추가
: https://github.com/postcss/autoprefixer/blob/master/README.md
: https://webactually.com/2018/10/ie%EC%97%90%EC%84%9C-css-%EA%B7%B8%EB%A6%AC%EB%93%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-css-%EA%B7%B8%EB%A6%AC%EB%93%9C%EC%99%80-autoprefixer/
: 위 한글문서와 다른점 autoplace 지원
- js minified 설정 추가
- 이미지 최적화 추가

- 이미지 스프라이트 추가 (vw???)
: https://blog.outsider.ne.kr/1133
- awesome font 추가
- md파일 추가
*/