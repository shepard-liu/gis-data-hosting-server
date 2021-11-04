// @ts-nocheck
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ArcGISWebpackPlugin = require('@arcgis/webpack-plugin');

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ]
    },
    entry: {
        index: './ui/src/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development'
        }),
        new ArcGISWebpackPlugin(),
    ],
    devtool: 'cheap-source-map',
    devServer: {
        static: './dist',
        host: 'localhost',
        port: '3000'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './public'),
        clean: true,
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    }
}