var webpack = require('webpack');

module.exports = {
  entry: './react_components/main.jsx',
  output: {
    path: './public/scripts',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015', 'react']
          }
      }
    ]
  },
  externals: {
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
