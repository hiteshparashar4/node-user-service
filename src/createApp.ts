import express from 'express';
import morgan from 'morgan';
import errorHandler from '@/middleware/errorHandler';
import { initContainer } from '@/containers/initContainer';

const createApp = async () => {
  const app = express();
  app.use(morgan(process.env.MORGAN_FORMAT || 'dev'));
  app.use(express.json());

  app.locals.dbReady = false;
  app.locals.container = null;

  initContainer(app);

  app.get('/live', (_req, res) => res.json({ status: 'alive' }));
  app.get('/', (_req, res) => res.send(app.locals.dbReady ? 'App is up (DB ready)' : 'App is up (DB not ready)'));

  app.get('/ready', async (_req, res) => {
    if (!app.locals.dbReady) return res.status(503).json({ status: 'not_ready', detail: 'database not connected' });
    try {
      const sequelize = app.locals.container.resolve('sequelize') as any;
      await sequelize.query('SELECT 1');
      return res.json({ status: 'ready' });
    } catch (err: any) {
      return res.status(503).json({ status: 'not_ready', detail: err.message });
    }
  });

  app.use(errorHandler);
  return app;
};

export default createApp;
