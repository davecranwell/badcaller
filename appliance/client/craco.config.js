const webpack = require('webpack')
const config = require('config')

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.DefinePlugin({
          CONFIG: JSON.stringify(config),
        }),
      ],
    },
  },
}
