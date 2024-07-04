const createError = require('http-errors');
const express = require('express');
require('express-async-errors');
const http = require('http');

const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const hpp = require('hpp');
const session = require('express-session');

const expressValidator = require('express-validator');
const verifyJwt = require('./config/auth_token');
const cors = require('cors');
const compression = require('compression');
const { StatusCodes } = require('http-status-codes');
const apiStats = require('swagger-stats');
const config = require('./config');

const usersRouter = require('./routes/auth/users_auth');
const refreshTokenRouter = require('./routes/auth/refresh_token');
const foodCategoryRouter = require('./routes/food_category/food_category_routes');
const mealTypeRouter = require('./routes/meal_type');
const mealPlanRouter = require('./routes/meal_plan/meal_plan');
const meals = require('./routes/meals/meals');
const mealmealType = require('./routes/meal_mealtype/meal_mealtype');
const mealplanTimeRoutes = require('./routes/meal_plan_time/meal_plan_time');
const foodItemRoutes = require('./routes/food_items/food_items');
const foodVariationRoutes = require('./routes/food_variations/food_variations');
const errorHandler = require('./middlewares/custom_errors/error-handler');
const dbHealth = require('./routes/health/health');

const { serverAdapter } = require('./globals/services/queues/base-queue');

class MealPlanServer {
  #app;

  constructor(app) {
    this.#app = app;
  }

  start() {
    this.#securityMiddleware(this.#app);
    this.#standardMiddleware(this.#app);
    this.#routeMiddleware(this.#app);
    this.#apiMonitoring(this.#app);
    this.#globalErrorHandler(this.#app);
    this.#startServer(this.#app);
  }

  #apiMonitoring(app) {
    app.use(
      apiStats.getMiddleware({
        uriPath: '/api-monitoring'
      })
    );
  }

  #securityMiddleware(app) {
    const corsOptions = {
      origin: 'http://localhost:5173',
      credentials: true, //access-control-allow-credentials:true
      optionSuccessStatus: 200
    };
    app.use(helmet());
    app.use(cors(corsOptions));

    // prevent parameter pollution
    app.use(hpp({ checkQuery: false, checkBody: false }));
    // remember to migrate the secrete to .env

    app.use(cookieParser(config.COOKIE_PASSWORD, { signed: true }));
    app.use(
      session({
        name: config.SESSION_NAME,
        secret: config.COOKIE_PASSWORD,
        resave: false,
        saveUninitialized: false
      })
    );
  }
  #standardMiddleware(app) {
    app.use(
      compression({
        level: 6,
        threshold: 100 * 1000, // threshold on to which no data will be compressed. default is zero in bytes,
        filter: (req, res) => {
          if (req.headers['x-no-compression']) {
            return false;
          }
          return compression.filter(req, res);
        }
      })
    );
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(expressValidator());
  }
  #routeMiddleware(app) {
    let baseurl = '/api/mealplan';
    app.use('/queues', serverAdapter.getRouter());

    app.use('/user', usersRouter);
    app.use('/user/token', refreshTokenRouter);

    app.use('/api/meal/types', mealTypeRouter);
    app.use(`${baseurl}/plan`, mealPlanRouter);
    app.use(`${baseurl}/meals`, meals);
    app.use('/api/meal/meal/type', mealmealType);
    app.use(`${baseurl}/mealplantimes`, mealplanTimeRoutes);
    app.use('/api/food/fooditems', foodItemRoutes);
    app.use('/api/food/variation', foodVariationRoutes);
    app.use('/health', dbHealth);
    // app.use(verifyJwt); // make sure you add this on top of all the routes that have to use jwt.
    app.use(`${baseurl}/category`, foodCategoryRouter);
  }
  #globalErrorHandler(app) {
    app.use('*', (req, res) => {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });
    // error handler
    app.use(errorHandler);
  }
  #startServer(app) {
    try {
      const httpServer = new http.Server(app);
      this.#startHttpServer(httpServer);
    } catch (error) {
      console.log('server error ', error);
    }
  }
  #startHttpServer(httpServer) {
    httpServer.listen(config.PORT || 3000, () => {
      console.log('app is running well');
    });
  }
}

module.exports = MealPlanServer;
