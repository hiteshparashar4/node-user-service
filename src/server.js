require('source-map-support/register');
require('dotenv').config();
const createApp = require('./createApp');

const PORT = process.env.PORT || 3000;

const app = await createApp();
const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

const shutdown = async () => {
  console.log('Shutting down...');
  server.close(async () => {
    try {
      const container = app.locals.container;
      if (container) {
        const sequelize = container.resolve('sequelize');
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
export {};
