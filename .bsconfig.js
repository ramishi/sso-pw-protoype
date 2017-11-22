/* 
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 | http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 */

var ssi = require('browsersync-ssi');

module.exports = {
  "files": [
    "dist/css/*.css",
    "dist/js/*.js",
    "dist/*.html",
    "!node_modules/**/*.html"
  ],

  "server": {
    baseDir: ['./dist/'],

    "middleware": ssi({
      baseDir: __dirname + '/dist/',
      ext: '.html',
      version: '1.4.0'
    })

  },
  "port": 3000,
  "debugInfo": true
};
