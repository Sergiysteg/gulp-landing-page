const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const image = require('gulp-image');
const fonter = require('gulp-fonter');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();

const paths = {
    fonts: {
        src: 'app/fonts/**/*.*',
        dest: 'build/fonts'
    },
    img: {
        src: 'app/img/*.*',
        dest: 'build/img'
    },
    styles: {
        src: 'app/style/**/*.css',
        dest: 'build/styles'
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/scripts'
    },
    html: {
        src: 'app/**/*.html',
        dest: 'build/'
    }
};

function browser(done) {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        port: 3001
    });
    done();
};
function browserReload(done) {
    browserSync.reload();
    done();
}

function fonts(){
    return gulp.src(paths.fonts.src)
        .pipe(fonter())
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.stream())
}

function images(){
    return gulp.src(paths.img.src)
        .pipe(image())
        .pipe(gulp.dest(paths.img.dest))
        .pipe(browserSync.stream())
}

function styles(){
    return gulp.src(paths.styles.src)
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

function scripts(){
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream())
}

function html(){
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream())
}

function watch(){
    gulp.watch(paths.fonts.src, fonts)
    gulp.watch(paths.img.src, images);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.html.src, html);
    gulp.watch('./app/*.html', gulp.series(browserReload));
}

function clear(){
    return del(['build']);
}

const build = gulp.series(clear, gulp.parallel(fonts, images, styles, scripts, html));

gulp.task('build', build);

gulp.task('default', gulp.parallel(watch, build));
gulp.task('default', browser);