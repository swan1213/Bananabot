var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var express = require('express');
var exphbs  = require('express-handlebars');

var port = process.env.PORT || 8005;

var webpackConfig = require("./webpack.config");
var env = (process.env.ENVIRONMENT === "local") ? "development" : "production"; 
var config = webpackConfig(env);

module.exports = {
	start: () => {
		var app = express();

		app.engine('handlebars', exphbs({}));

		app.set('view engine', 'handlebars');
		app.set('views', __dirname + '/templates');

		var server = app.listen(8000, function() {
			var host = server.address().address;
			var port = server.address().port;

			app.use('/static', express.static(__dirname + '/dist'));

			app.get('/*', function (req, res) {
				var assets = require("./webpack-assets.json");

				res.render('index', {
					'JS_BUNDLE_LOCATION': assets.main.js,
					'GRAPHQL_ENDPOINT': process.env.GRAPHQL_ENDPOINT
				});
			});

			console.log('Listening at http://%s:%s', host, port);
		});
	}
};
