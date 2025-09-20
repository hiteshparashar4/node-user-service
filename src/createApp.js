const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const { initBackgroundContainer } = require('./startup/initContainer');

const createApp = async () => {
  const app = express();
  app.use(morgan(process.env.MORGAN_FORMAT || 'dev'));
  app.use(express.json());

  app.locals.dbReady = false;
  app.locals.container = null;

  initBackgroundContainer(app);

  app.get('/live', (req, res) => res.json({ status: 'alive' }));
  app.get('/', (req, res) => res.send(app.locals.dbReady ? 'App is up (DB ready)' : 'App is up (DB not ready)'));

  app.get('/ready', async (req, res) => {
    if (!app.locals.dbReady) return res.status(503).json({ status: 'not_ready', detail: 'database not connected' });
    try {
      const sequelize = app.locals.container.resolve('sequelize');
      await sequelize.query('SELECT 1');
      return res.json({ status: 'ready' });
    } catch (err) {
      return res.status(503).json({ status: 'not_ready', detail: err.message });
    }
  });

  app.use(errorHandler);
  return app;
};

module.exports = createApp;