const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './ct-sr/script/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './ct-sr')
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'], exclude: /node_modules/ }
    ]
  },
  resolve: {
    extensions: ['.js', '.less'],
    fallback: {
      path: false,
      fs: false
    }
  }
}
