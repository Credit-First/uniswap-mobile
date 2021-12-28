const extraNodeModules = require('node-libs-browser');

module.exports = {
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ['./assets/fonts/'], // stays the same
  extraNodeModules,
};
