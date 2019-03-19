'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var crypto = require('crypto');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.route("/v1/public").get(Get);
app.route("/v1/public/*").get(Get_Characters);
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

module.exports = server;

function Get(req, res)
{
  return res.json({ goodCall: true });
}

function Get_Characters(req, res)
{
  const
    apiKey = "a4ce240a80425a2ba715c8baf78048b6",
    ts = "1",
    publicKey = "a4ce240a80425a2ba715c8baf78048b6",
    privateKey = "4711f770abe38a3f232b6010017c06a1bc07aabd",
    data = ts + privateKey + publicKey,
    hash = crypto.createHash('md5').update(data).digest("hex"),
    marvel_url = "https://gateway.marvel.com:443/v1/public",
    url = req.url.replace("/v1/public", marvel_url) + "&apikey=" + apiKey + "&hash=" + hash + "&ts=" + ts;

  request(url).pipe(res);
}
