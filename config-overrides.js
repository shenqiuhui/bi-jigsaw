const path = require('path');
const { override, addWebpackAlias, addLessLoader } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  addLessLoader({
    lessOptions: {
      strictMath: true,
      noIeCompat: true
    }
  })
);