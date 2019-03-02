const path = require('path'),
    log = require('fancy-log'),
    webpack = require('webpack'),
    packageInfo = require('./package'),
    glob = require('glob');

const sounds = glob.sync(packageInfo.paths.sounds);

module.exports = {
    entry: {
        app: './src/js/app.js',
    },
    output: {
        path: path.join(__dirname, "./dist/js"),
        filename: '[name].bundle.js'
    },
    devServer : {
        inline : true,
        port : 3333
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        ['@babel/env'],
                    ],
                },
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: path.join(__dirname, 'dist/lib/jquery.labeleffect.js'),
                use: [ 'script-loader' ]
            }
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.DefinePlugin({
            sounds: JSON.stringify(sounds)
        })
    ]
};