#!/usr/bin/env node


const browserify = require('browserify');
const UglifyJS = require('uglifyjs');
const path = require('path');
const fs = require('fs');

const isPostinstall = Boolean(process.env.POSTINSTALL);
const isProduction = process.env.NODE_ENV === 'production';
let shouldRun = true;
if (isPostinstall && !isProduction) shouldRun = false;
if (shouldRun) bundle();

function bundle () {
  const bundler = browserify(path.resolve(__dirname, '../lib/index.js'), {
    transform: [
      'babelify',
      'glslify',
      [ 'loose-envify', {
        NODE_ENV: 'production',
        global: true
      } ]
    ]
  });

  console.log('Build script initated with mode: %s', isPostinstall ? 'postinstall' : 'build');
  console.log('Environment: ', isProduction ? 'production' : 'development');
  console.log('Bundling...');
  bundler.bundle(function (err, src) {
    if (err) throw err;
    console.log('Compressing bundle...');
    const result = UglifyJS.minify(src.toString(), { fromString: true }).code
    fs.writeFile(path.resolve(__dirname, '../app/bundle.js'), result, err => {
      if (err) throw err;
      console.log('Bundle complete!');
    });
  });
}
