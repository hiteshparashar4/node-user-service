import 'source-map-support/register';
import dotenv from 'dotenv';
dotenv.config();
import createApp from '@/createApp';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

(async () => {
  const app = await createApp();
  const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

  const shutdown = async () => {
    console.log('Shutting down...');
    server.close(async () => {
      try {
        const container = (app as any).locals.container;
        if (container) {
          const sequelize = container.resolve('sequelize') as any;
          if (sequelize) {
            await sequelize.close();
            console.log('Sequelize connection closed');
          }
        }
      } catch (err) {
        console.error('Error during shutdown', err);
      } finally {
        process.exit(0);
      }
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();