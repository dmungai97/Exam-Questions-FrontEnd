/* eslint-disable no-undef */
module.exports = {
  devServer: {
    proxy: {
      '^': {
        target: 'http://localhost:5000',
        ws: true
      }
    }
  }
};
