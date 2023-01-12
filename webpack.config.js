const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const path = require('path')

const pluginsList = [
    new HtmlPlugin({
        hash: true,
        filename: 'index.html',
        template: './src/index.html',
    }),
    new CopyPlugin({
        patterns: [
            {
                from: 'src/icons/favicon',
                to: 'icons',
            },
            {
                from: 'node_modules/trumbowyg/dist/ui/icons.svg',
                to: 'icons/trumbowyg_icons.svg',
            },
            {
                from: 'src/files',
                to: 'files',
            },
        ],
    }),
    new ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
    }),
]

// Configure response image support
const responsiveLoader = {
    test: /\.(png|jpe?g)$/,
    use: [
        {
            loader: 'responsive-loader',
            options: {
                adapter: require('responsive-loader/sharp'),
                name: 'images/responsive/[hash]_[width].[ext]',
                sizes: [420, 860, 1200, 2400],
            },
        },
    ],
}

// Cache responsive images in dev mode
const isDev = process.env.WEBPACK_ENV === 'dev'
if (isDev) {
    console.log('Development mode: using responsive image cache.')
    responsiveLoader.use.unshift('cache-loader')
} else {
    pluginsList.unshift(new CleanWebpackPlugin())
}

module.exports = {
    entry: './src/index.js',
    plugins: pluginsList,
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            responsiveLoader,
        ],
    },

    node: false,
    output: {
        filename: 'bundle.js',
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        open: false,
        port: 9000,
    },

    devtool: isDev ? 'eval-cheap-source-map' : undefined,
    mode: isDev ? 'development' : 'production',
}
