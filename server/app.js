"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const passport = require("passport");
const usersRouter_1 = require("./routes/usersRouter");
const dataRouter_1 = require("./routes/dataRouter");
const staticRouter_1 = require("./routes/staticRouter");
const app = express();
exports.app = app;
// // Configuring Webpack development server
// import webpackConfig from './webpack.config';
// const webpackCompiler = webpack(webpackConfig as webpack.Configuration);
// app.use(webpackDevMiddleware(webpackCompiler, {
//   publicPath: webpackConfig.output.publicPath,
// }));
// Use passport
app.use(passport.initialize());
// Setting up server
app.set('port', 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// initialize routers
app.use('/users', usersRouter_1.default);
app.use('/api/data', dataRouter_1.default);
app.use('/', staticRouter_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
