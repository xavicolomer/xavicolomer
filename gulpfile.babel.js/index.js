const gulp = require('gulp');
const fs = require('fs');
const awspublish = require('gulp-awspublish');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const rename = require('gulp-rename');
const webpack = require('gulp-webpack');
const webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const gzip = require('gulp-gzip');
const cloudfront = require('gulp-cloudfront-invalidate');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');

const aws = JSON.parse(fs.readFileSync('./settings/aws.json'));
const staticFolder = 'static';

gulp.task('sass', () => {
  gulp.src('src/scss/app.scss')
    .pipe(sass({
      includePaths: ['./node_modules/breakpoint-sass/stylesheets']
    }).on('error', sass.logError))
    .pipe(prefix(
      'last 1 version', '> 1%', 'ie 11'
    ))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(staticFolder + '/css/'));
});

gulp.task('sass-prod', () => {
  gulp.src('src/scss/app.scss')
    .pipe(sass({
      includePaths: ['./node_modules/breakpoint-sass/stylesheets'],
      style: 'compressed'
    }).on('error', sass.logError))
    .pipe(prefix(
      'last 1 version', '> 1%', 'ie 11'
    ))
    .pipe(minifycss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(staticFolder + '/css/'))
    .pipe(gzip())
    .pipe(gulp.dest(staticFolder + '/css/'));
});

gulp.task('scripts', () => {
  gulp.src('src/js/app.es6')
    .pipe(webpack({
      output: {
        filename: './app.min.js'
      },
      devtool: 'source-map',
      module: {
        loaders: [{
          test: /\.es6$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        },
        { test: /\.json$/, loader: 'json' }
        ]
      }
    }))
    .pipe(gulp.dest(staticFolder + '/js'));
});

gulp.task('scripts-prod', () => {
  gulp.src('src/js/app.es6')
    .pipe(webpack({
      output: {
        filename: './app.min.js'
      },
      module: {
        loaders: [{
          test: /\.es6$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }]
      },
      plugins: [
        new webpackUglifyJsPlugin({
          debug: true,
          minimize: true,
          sourceMap: false,
          cacheFolder: './cached/cached_uglify/',
          compress: {
            warnings: false,
            dead_code: true
          },
          mangle: { toplevel: true }
        },
        new CompressionPlugin({
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.html$/,
          threshold: 10240,
          minRatio: 0.8
        }))
      ]
    }))
    .pipe(gulp.dest(staticFolder + '/js/'))
    .pipe(gzip())
    .pipe(gulp.dest(staticFolder + '/js/'));
});

gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.es6', ['scripts']);
});

gulp.task('deploy',
  ['scripts-prod', 'sass-prod', 'upload', 'cloudfront']);
gulp.task('pre',
  ['scripts', 'sass']);

gulp.task('upload', () => {
  if (!fs.existsSync('./cached')) {
    fs.mkdirSync('./cached');
  }

  const publisher = awspublish.create(aws, {
    cacheFileName: './cached/.awspublished.xavicolomer.com'
  });

  const headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src('./' + staticFolder + '/**')
    .pipe(publisher.publish(headers))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

gulp.task('cloudfront', ['upload'], () => {
  return gulp.src('*')
    .pipe(cloudfront(aws));
});

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: 'http://localhost:8080',
    files: ['./src'],
    browser: 'google chrome',
    port: 9000
  });
});

gulp.task('nodemon', function (cb) {
  let started = false;

  return nodemon({
    script: 'server.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});
