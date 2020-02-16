const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProvidePlugin } = require('webpack');


const pluginsList = [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
        hash: true,
        filename: 'index.html',
        template: './src/index.html',
    }),
    new CopyWebpackPlugin([
        {
            from: 'src/icons/favicon',
            to: 'icons'
        },
        {
            from: 'node_modules/trumbowyg/dist/ui/icons.svg',
            to: 'icons/trumbowyg_icons.svg'
        },
        {
            from: 'src/files',
            to: 'files'
        }
    ]),
    new ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery'
    })
]

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
} else {
    pluginsList.unshift(new CleanWebpackPlugin())
}

module.exports = {

    entry: "./src/index.js",
    output: {
        filename: "bundle.js"
    },

    plugins: pluginsList,

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
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            responsiveLoader
        ],
    },

    devtool: 'source-map'

}