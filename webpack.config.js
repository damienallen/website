const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const responsiveLoader = {
    test: /\.(jpe?g|png)$/i,
    use: [
        {
            loader: 'responsive-loader',
            options: {
                sizes: [420, 860, 1200, 2400],
                adapter: require('responsive-loader/sharp'),
                name: 'images/responsive/[hash]_[width].[ext]'
            }
        }
    ]
}

// Cache responsive images in dev mode
if (process.env.WEBPACK_ENV === 'dev') {
    console.log('Development mode: using responsive image cache.')
    responsiveLoader.use.unshift('cache-loader')
}

module.exports = {

    entry: "./src/index.js",
    output: {
        filename: "bundle.js"
    },

    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'index.html',
            template: './src/index.html',
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/images/animations',
                to: 'images/animations'
            },
            {
                from: 'src/images/news_thumbs',
                to: 'images/news_thumbs'
            },
            {
                from: 'src/icons',
                to: 'icons'
            },
            {
                from: 'src/files',
                to: 'files'
            }
        ])
    ],

    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(s*)css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader?url=false', 'sass-loader']
            },
            responsiveLoader
        ],
    },

    devtool: 'source-map'

}