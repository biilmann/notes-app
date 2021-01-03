const path = require("path")

module.exports = {
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
        'pg-native': path.join(__dirname, 'webpack/aliases/pg-native.js'),
        'pgpass$': path.join(__dirname, 'webpack/aliases/pgpass.js'),
      },
  },
};
