const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    postcssImport(),
    postcssNested(),
    autoprefixer()
  ]
};
