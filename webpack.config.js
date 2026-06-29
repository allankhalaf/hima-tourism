const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './src/js/index.js',
    planner: './src/js/planner.js',
    gallery: './src/js/gallery.js',
    checklist: './src/js/checklist.js'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
    publicPath: '/hima-tourism/',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    
    // index.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html',
      chunks: ['main']
    }),
    
    // pages/contact.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'pages/contact.html'),
      filename: 'pages/contact.html',
      chunks: ['main']
    }),
    
    // pages/planner.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'pages/planner.html'),
      filename: 'pages/planner.html',
      chunks: ['planner']  // ← يحتاج planner.js + main.js
    }),
    
    // pages/gallery.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'pages/gallery.html'),
      filename: 'pages/gallery.html',
      chunks: ['gallery']
    }),
    
    // pages/checklist.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'pages/checklist.html'),
      filename: 'pages/checklist.html',
      chunks: ['checklist']
    }),
    
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/images'),
          to: path.resolve(__dirname, 'dist/images'),
          noErrorOnMissing: true
        }
      ]
    })
  ]
};