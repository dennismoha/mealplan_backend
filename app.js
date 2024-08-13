const express = require('express');

const MealPlanServer = require('./setup_server');
const { checkDatabaseConnection, closeDatabaseConnection } = require('./setup_database');
const config = require('./config');

class Application {
  initializeApp() {
    this.#loadConfiguration();
    checkDatabaseConnection();
    const app = express();
    const server = new MealPlanServer(app);
    server.start();
    Application.#handleExceptions();
  }

  #loadConfiguration() {
    config.validateConfig();
  }

  // catch exceptions

  static #handleExceptions() {
    process.on('unCaughtException', (error) => {
      console.log('error ', error);
      Application.shutDownProperly(1);
    });

    process.on('unhandleRejection', (error) => {
      console.log('error ', error);
      Application.shutDownProperly(2);
    });

    process.on('SIGTERM', (error) => {
      console.log('error ', error);
      Application.#shutDownProperly(2);
    });

    process.on('exit', (error) => {
      console.log('error ', error);
      Application.#shutDownProperly(2);
    });

    process.on('SIGINT', async function () {
      try {
        await closeDatabaseConnection();
      } catch (error) {
        process.exit(error ? 1 : 0);
      }
    });
  }

  static #shutDownProperly(exitCode) {
    Promise.resolve()
      .then(() => {
        process.exit(exitCode);
      })
      .catch((error) => {
        console.log('error shutting down ', error);
        process.exit(1);
      });
  }
}

const application = new Application();
application.initializeApp();
