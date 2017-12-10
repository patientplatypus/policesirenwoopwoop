var express = require('express');
require('dotenv').config()
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var dependencies = require('./routes/dependencies');
var smoketest = require('./routes/smoketest');
var geometries = require('./routes/geometries');

// var initialize = require('./routes/initialize');


//postgres database connected as well in case mongo doesn't work :D
var pg=require('pg');
var conString=process.env.PG_HOST;
var client = new pg.Client(conString);
client.connect();

var app = express();
var cors = require('cors')

var mongoose = require('mongoose');

mongoose.connect(process.env.DB_HOST);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var client = new pg.Client(conString);
client.connect();


app.use('/', index(client));
app.use('/dependencies', dependencies(client));
app.use('/smoketest', smoketest(client));
app.use('/geometries', geometries(client));

// app.use('/initialize', initialize(client));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
  console.log('  Press CTRL-C to stop\n');
})

module.exports = app;
