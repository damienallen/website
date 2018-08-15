// Load requirements
const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const minifyJS = require('gulp-minify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const merge = require('merge-stream');


// Source directories
const staticSrc = 'assets';
const styleSrc = staticSrc + '/styles/**/*.scss';
const scriptSrc = staticSrc + '/scripts/**/*.js';
const imageSrc = staticSrc + '/images/**';
const templateSrc = 'base/templates/**/*.html';

// Build directories
const buildDir = 'static';
const cssDir = buildDir + '/css';
const jsDir = buildDir + '/js';
const imgDir = buildDir + '/img';
const fontDir = buildDir + '/fonts';

// Uncompressed file directories
const cssSrc = [cssDir + '/**/*.css', '!' + cssDir + '/**/*.min.css'];
const jsSrc = [jsDir + '/**/*.js', '!' + jsDir + '/**/*.min.js'];

// Compile and copy SASS files
gulp.task('sass', (done)=>{
    gulp.src(styleSrc).pipe(sass()).pipe(gulp.dest(cssDir));
    done();
});

// Copy dashboard JS files
gulp.task('js', (done)=>{
    gulp.src(scriptSrc).pipe(gulp.dest(jsDir));
    done();
});

gulp.task('img', (done)=>{
    gulp.src(imageSrc).pipe(imagemin()).pipe(gulp.dest(imgDir)).pipe(browserSync.stream());
    done();
});

gulp.task('lib', ()=>{
    return merge(
        // Dependencies from node_modules
        gulp.src('node_modules/jquery/dist/jquery.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/bootstrap/dist/**/*').pipe(gulp.dest(buildDir)),
        gulp.src('node_modules/codemirror/lib/codemirror.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/codemirror/lib/codemirror.css').pipe(gulp.dest(cssDir)),
        gulp.src('node_modules/codemirror/mode/markdown/markdown.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/codemirror/mode/xml/xml.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/codemirror/mode/gfm/gfm.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/codemirror/addon/mode/overlay.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/marked/lib/marked.js').pipe(gulp.dest(jsDir)),
        gulp.src('node_modules/popper.js/dist/popper.js').pipe(gulp.dest(jsDir)),
        // Font icons
        gulp.src('node_modules/font-awesome/css/font-awesome.css').pipe(gulp.dest(cssDir)),
        gulp.src('node_modules/font-awesome/fonts/*').pipe(gulp.dest(fontDir)),
    )
});

gulp.task('minifycss', (done)=>{
    gulp.src(cssSrc)
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(cssDir))
        .pipe(browserSync.stream());
    done();
});

gulp.task('minifyjs', (done)=>{
    gulp.src(jsSrc)
        .pipe(minifyJS({
            ext:{
                min:'.min.js'
            },
            ignoreFiles: ['.min.js']
        }))
        .pipe(gulp.dest(jsDir))
        .pipe(browserSync.stream());
    done();
});

// Serve command called by django-gulp
gulp.task('serve', gulp.series(gulp.parallel('sass', 'js', 'img', 'lib'), gulp.parallel('minifycss', 'minifyjs'), ()=>{
    browserSync.init({
        injectChanges: true,
        notify: false,
        // open: false,
        port: 8000,
        proxy: {
            target: 'localhost:8000',
            proxyOptions: {
                changeOrigin: false
            }
        },
    });
    gulp.watch(styleSrc, gulp.series('sass', 'minifycss'));
    gulp.watch(scriptSrc).on('change', gulp.series('js', 'minifyjs'));
    gulp.watch(templateSrc).on('change', browserSync.reload);
}));

gulp.task('clean', () => del([buildDir]));
gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'js', 'img', 'lib'), gulp.parallel('minifycss', 'minifyjs')));
gulp.task('default', gulp.series('serve'));
