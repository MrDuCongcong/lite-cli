const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const Webpack = require('webpack');
const { resolve } = require('path');

module.exports = {
    entry: {
        main: path.resolve(__dirname, '../main.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
    },
    devtool: 'inline-source-map',
    devServer: {},
    mode: 'development',
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.scss|.css$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
            url: '',
        }),
        new VueLoaderPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
    ],
};
