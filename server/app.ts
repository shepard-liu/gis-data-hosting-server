import * as createError from 'http-errors';
import * as express from 'express';
import webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as path from 'path';
import * as passport from 'passport';
import usersRouter  from './routes/usersRouter';
import dataRouter from './routes/dataRouter';
import staticRouter from './routes/staticRouter'

const app = express();

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
app.use('/users', usersRouter);
app.use('/api/data', dataRouter);
app.use('/', staticRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export { app };