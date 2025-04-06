// craco.config.js
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@services': path.resolve(__dirname, 'services'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@assets': path.resolve(__dirname, 'assets')
    }
  }
};