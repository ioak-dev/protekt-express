var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var bookmarkRouter = require('./routes/bookmark');
var noteRouter = require('./routes/note');

var app = express();
app.use(cors());

var jwt = require('jsonwebtoken');

const jwtsecret = 'jwtsecret';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');
// const databaseUri = 'mongodb://localhost:27017/protekt';
const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/protekt';
mongoose.connect(databaseUri);

// authorize requests
app.use(function(req, res, next) {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization.split(" ")[1], jwtsecret, function(err, decoded) {
      if (decoded) {
        req.auth = decoded;
        next();
      } else {
        res.status(401).send({
          status: 401
        });
      }
    });
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/bookmark', bookmarkRouter);
app.use('/note', noteRouter);

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

// process.on('uncaughtException', err => {console.log(err);})

module.exports = app;
