const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const path = require("path");

rules.push({
  test: /\.module\.s?[ac]ss$/,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
        modules: {
          localIdentName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    "sass-loader",
  ],
});

rules.push({
  test: /\.s?[ac]ss$/i,
  use: ["style-loader", "css-loader", "sass-loader"],
  exclude: /\.module\.s?[ac]ss$/,
});

rules.push({
  test: /\.(png|jpg|gif|woff(2)?|ttf|eot)$/,
  use: ["file-loader"],
});

rules.push({
  test: /\.svg$/,
  use: [
    {
      loader: "@svgr/webpack",
      options: { svgoConfig: { plugins: { removeViewBox: false } } },
    },
    "file-loader",
  ],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".scss", ".sass"],
  },
};
