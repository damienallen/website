const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { ProvidePlugin } = require('webpack')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const path = require('path')

const isDev = process.env.WEBPACK_ENV === 'dev'

const plugins = [
    new HtmlPlugin({
        hash: true,
        filename: 'index.html',
        template: './src/index.html',
    }),
    new CopyPlugin({
        patterns: [
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
// const responsiveLoader = {
//     test: /\.(png|jpe?g)$/,
//     use: [
//         {
//             loader: 'responsive-loader',
//             options: {
//                 adapter: require('responsive-loader/sharp'),
//                 name: 'images/responsive/[contenthash]_[width].[ext]',
//                 sizes: [420, 860, 1200, 2400],
//             },
//         },
//     ],
// }

// Clean builds for production
if (!isDev) {
    plugins.unshift(new CleanWebpackPlugin())
}

const optimization = {
    minimizer: [
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.sharpMinify,
            },
        }),
    ],
}

module.exports = {
    plugins: plugins,
    optimization: optimization,
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
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset',
            },
        ],
    },

    resolve: {
        fallback: {
            fs: false,
        },
    },
    // output: {
    //     filename: 'bundle.js',
    // },

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
