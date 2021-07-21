const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "production",
  entry: ['./src/js/index.js', './src/scss/main.scss'],

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [{
          loader: "file-loader",
          options: {
            outputPath: 'img',
            name: '[name].[ext]'
          }
        }]
      },
      {
        test: /\.(scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/pug/index.pug',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    })
  ],
  output: {
    filename: 'js/main.js',
  },
};