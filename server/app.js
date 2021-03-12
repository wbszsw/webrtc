var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// server.listen(1024, function () {
//     console.log('Socket Open')
// });


app.all('*', function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*");  
  
  // 'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authorization');  
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS,HEAD");  
  // res.header("authorization", '*');  
    // res.header("Content-Type", "application/json;charset=utf-8");  
  if (req.method == 'options' || req.method == 'OPTIONS') {
      console.log('options这里')
      // res.send(200)
      res.status(200).json('返回成功');
  }  
  next();  
}); 
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
