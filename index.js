const path = require('path');
const decompress = require('decompress');
const replace = require('replace-in-file');

const TEMP_DIR = path.resolve('.tmpIcomoon');

function exportIcomoon(){
    return files.map(files.map(item => {
        return fs.copy(item.src, item.dest);
    })).then(() => {
        console.log('copied icomoon files');
    });
}

// node
// node_modules/.bin/icomoon-builder
// export
//
// <fontName>
// <icomoonZipFile>
// <preProcessorPath>
// <cssPath>
// <fontsPath>
// <docsPath>
//?<ligaPath>

// node
// node_modules/.bin/icomoon-builder
// export
//
// fancy-icons
// ~/Downloads/icomoon.zip
// scss
// css
// fonts
// docs
//?liga

function getFiles(fontName, paths){
    let files = [
        {
            src: path.resolve(TEMP_DIR, 'demo-files/demo.css'),
            dest: path.resolve(paths.docs, 'demo/styles.css')
        },
        {
            src: path.resolve(TEMP_DIR, 'demo-files/demo.js'),
            dest: path.resolve(paths.docs, 'demo/scripts.js')
        },

        // fonts
        {
            src: path.resolve(TEMP_DIR, 'fonts/...'),
            dest: path.resolve(paths.docs, 'fonts/...')
        },
        // //fonts

        {
            src: path.resolve(TEMP_DIR, 'demo.html'),
            dest: path.resolve(paths.docs, 'demo/index.html')
        },

        // liga
        {
            src: path.resolve(TEMP_DIR, 'liga.js'),
            dest: path.resolve(paths.docs, 'liga.js')
        },
        // //liga

        {
            src: path.resolve(TEMP_DIR, 'selection.json'),
            dest: path.resolve(paths.docs, 'icomoon.json')
        },
        {
            src: path.resolve(TEMP_DIR, 'style.css'),
            dest: path.resolve(paths.css, `${fontName}.css`)
        },
        {
            src: path.resolve(paths.css, 'style.scss'),
            dest: path.resolve(paths.css, 'style.scss')
        },
        {
            src: path.resolve(paths.css, 'variables.scss'),
            dest: path.resolve(paths.css, 'variables.scss')
        }
    ];

    return files;
}

function unzipIcomoon(file){
    var icomoon = file;

    return decompress(icomoon, TEMP_DIR).then(files => {
        console.log('unzipped icomoon file');
    });
}

function copyFiles(){}





moduel.exports = exportIcomoon;