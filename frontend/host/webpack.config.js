const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8080/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8080,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        auth: 'auth@http://localhost:8081/remoteEntry.js',
        // catalog: 'catalog@http://localhost:8082/remoteEntry.js',
        // insertion: 'insertion@http://localhost:8083/remoteEntry.js',
        profile: 'profile@http://localhost:8084/remoteEntry.js'
      },
      exposes: {},
      shared: ["react", "react-dom"]
    }),
    // new HtmlWebPackPlugin({
    //   template: "./src/index.html",
    // }),
  ],
};
