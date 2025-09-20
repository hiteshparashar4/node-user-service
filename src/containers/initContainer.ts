import express from 'express';
import buildContainer from './container';
import createUserRouter from '@/controllers/userController/userRouter';
import { retryWithBackoff } from '@/helpers/retryAuth';
import { API_VERSION, API_PATH } from '@/constants/common'

const createProxyRouter = () => {
  const router = express.Router();
  router.all('*', (_req, res) => res.status(503).json({ error: 'Service temporarily unavailable - database not ready' }));
  return router;
};

export const initContainer = (app: express.Express): void => {
  const proxyRouter = createProxyRouter();
  app.use(`/${API_VERSION}/${API_PATH}`, proxyRouter);

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