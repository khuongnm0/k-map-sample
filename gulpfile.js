const { src, dest, watch, series, parallel } = require('gulp')
const browserSync = require('browser-sync').create()

const pug = require('gulp-pug')
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const del = require("del");
const babel = require('gulp-babel');


// Clean dist
function clean() {
  return del(["./dist/"]);
}

// Compile pug files into HTML
function html() {
  return src('src/views/*.pug')
    .pipe(pug())
    .pipe(dest('dist'))
}

// Compile sass files into CSS

const sassOptions = {
  includePaths: ['src/sass'],
  errLogToConsole: true,
  outputStyle: 'compressed',
  onError: browserSync.notify
};

function styles() {
  return src('src/scss/main.scss')
    .pipe(sass(sassOptions))
    .pipe(postcss([autoprefixer({ grid: 'autoplace' }), cssnano()]))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

// Compile js ES6 files into ES5
function script() {
  return src('src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}


// Copy assets
function assets() {
  return src('src/assets/**/*')
    .pipe(dest('dist/assets/'))
}

// Serve and watch sass/pug files for changes
function watchAndServe() {
  browserSync.init({
    server: 'dist',
  })

  watch('src/scss/**/*.scss', styles)
  watch('src/views/*.pug', html)
  watch('src/assets/**/*', assets)
  watch('src/js/**/*', script)
  watch('dist/*.html').on('change', browserSync.reload)
}


exports.html = html
exports.styles = styles
exports.script = script
exports.clean = clean
exports.watch = watchAndServe

// clean 'dist' when run 'gulp'
exports.default = series(clean, parallel(html, styles, script, assets), watchAndServe)