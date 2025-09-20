const buildContainer = require('./container');
const createUserRouter = require('../controllers/userController/userRouter');
const { retryWithBackoff } = require('../helpers/retryAuth');
const express = require('express');

const createProxyRouter = () => {
  const router = express.Router();
  router.all('*', (req, res) => res.status(503).json({ error: 'Service temporarily unavailable - database not ready' }));
  return router;
};

const initContainer = (app) => {
  const proxyRouter = createProxyRouter();
  app.use('/users', proxyRouter);

  (async () => {
    const maxAttempts = parseInt(process.env.DB_FAIL_MAX_ATTEMPTS || '5', 10);
    try {
      const container = await retryWithBackoff(() => buildContainer(), maxAttempts, 500);
      app.locals.container = container;
      app.locals.dbReady = true;
      console.log('DB container ready — mounting routers');
      const userController = container.resolve('userController');
      const userRouter = createUserRouter(userController);
      proxyRouter.stack = userRouter.stack;
    } catch (err) {
      console.error('DB initialization failed after retries. Exiting process.', err);
      process.exit(1);
    }
  })();
};

module.exports = { initContainer };