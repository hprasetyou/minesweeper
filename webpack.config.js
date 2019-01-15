const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },
  devtool: 'source-map',
  module: {
    rules: [{
                test: /\.(le|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "less-loader"
                ]
            },
      {
      test: /\.png$/,
      use: [{
        loader: "url-loader?limit=100000"
      }]
      }, {
      test: /\.jpg$/,
      use: [{
        loader: "file-loader"
      }]
    },{
      test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'    // where the fonts will go
        }
      }]
    },
    {
        test: /\.svg$/,
        loader: 'vue-svg-loader',
      },
     {
        test: /\.vue$/,
        loader: 'vue-loader'
      }]

  },
  plugins: [
  // make sure to include the plugin!
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({filename:'style.css'})
  ],
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './bundle.js'
  }
};
