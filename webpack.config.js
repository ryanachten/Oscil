const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");

module.exports = (env) => {
  const isProduction = env === "production";
  const CSSExtract = new ExtractTextPlugin("styles.css");
  return {
    entry: "./src/app.js",
    output: {
      path: path.join(__dirname, "public", "dist"),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          loader: "babel-loader",
          test: /\.js$/,
          exclude: /node_modules/,
        },
        {
          test: /\.s?css$/,
          use: CSSExtract.extract({
            use: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true,
                },
              },
            ],
          }),
        },
        {
          test: /\.svg/,
          use: {
            loader: "svg-url-loader",
            options: {},
          },
        },
      ],
    },
    plugins: [
      CSSExtract,
      new CompressionPlugin({ algorithm: "gzip" }),
      new BrotliPlugin(),
      new webpack.DefinePlugin({
        BASE_PATH: isProduction ? "'Oscil'" : "", // Site is served from /Oscil/ subdirectory in GitHub pages,
      }),
    ],
    devtool: isProduction ? "source-map" : "inline-source-map",
    devServer: {
      contentBase: path.join(__dirname, "public"),
      historyApiFallback: true,
      publicPath: "/dist/",
    },
  };
};
