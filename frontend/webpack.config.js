var path = require('path');
var webpack = require('webpack');
var _ =  require('lodash');
var AssetsPlugin = require('assets-webpack-plugin');

module.exports = function(mode) {
    var isHot = (mode === "development");

    var port = 8005;

    var definePlugin = new webpack.DefinePlugin({
        __HOT__: JSON.stringify(isHot),
    });

    var config = {
        devtool: 'eval',
        entry: [
            './frontend/src/index'
        ],
        output: {
            path: path.join(__dirname, ((isHot) ? 'frontend/dist' : 'dist')),
            filename: '[name].[chunkhash].js',
            publicPath: '/static/'
        },
        plugins: [
            definePlugin,
            (new AssetsPlugin({path: path.join(__dirname, ((isHot) ? '' : ''))}))
        ],
        node: {
            console: true,
            net: 'empty',
            fs: 'empty',
            tls: 'empty'
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loaders: ((isHot) ? ['react-hot', 'babel'] : ['babel']),
                    include: [
                        path.join(__dirname, 'src'),
                        /redux-resource/
                    ]
                },
                {
                    test: /\.json$/,
                    loaders: ['json']
                },
                {
                    test: /\.(scss|css)$/,
                    loaders: ['style', 'css', 'sass']
                },
                {
                    test: /\.(woff|eot|woff2|ttf)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file"
                },
                { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" },
                { test: /\.(jpg|png)(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000" }
            ]
        },
        watchOptions: {},
        resolve: {
            alias: {
                'react': path.join(process.cwd(), '../', 'node_modules', 'react')
            },
            extensions: ['', '.js']
        }
    };

    if (isHot) {
        config.output.filename = '[name].js';
        config.entry.unshift('webpack-dev-server/client?http://localhost:' + port, 'webpack/hot/only-dev-server');
        config.watch = true;
        config.watchOptions.poll = true;
        config.publicPath = 'http://localhost:' + port + '/static/';
        config.output.publicPath = 'http://localhost:' + port + '/static/';
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return config;
};
