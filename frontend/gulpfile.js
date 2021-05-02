var gulp = require('gulp');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var gutil = require('gutil');
var gtemplate = require('gulp-template');

var server = require("./server");
var webpackConfig = require("./webpack.config");

gulp.task('hello', function() {
	console.log('hello world!');
});

// Webpack
gulp.task("webpack:build", function(callback) {
    var config = webpackConfig("production");

    // run webpack
    webpack(config, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack:dev", function(callback) {
    var env = (process.env.ENVIRONMENT === "local") ? "development" : "production"; 
    var config = webpackConfig(env);

    // Start a webpack-dev-server
    var compiler = webpack(config);

    new WebpackDevServer(compiler, {
        // server and middleware options
        filename: "bundle.js",
        publicPath: "http://localhost:8005/static/",
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        secure: false,
        https: false,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
        // historyApiFallback: true
    }).listen(8005, "0.0.0.0", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);

        // listened
        console.log("started gulp webpack server");
        callback();
    });
});

gulp.task("node:server", function(callback) {
    server.start();
});

gulp.task('build', ['hello', 'webpack:build']);
gulp.task('default', ['hello', 'webpack:dev']);
gulp.task('dev', ['hello', 'webpack:dev', 'node:server']);
gulp.task('serve', ['node:server']);
