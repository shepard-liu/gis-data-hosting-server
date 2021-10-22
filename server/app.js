"use strict";
exports.__esModule = true;
exports.app = void 0;
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var users_1 = require("./routes/users");
var app = express();
exports.app = app;
// Setting up server
app.set('port', 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', users_1.usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
