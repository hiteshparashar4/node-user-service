require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');

const runMigrations = async () => {
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  });

  const glob = path.join(__dirname, '..', 'migrations', '20250919-create-users.js');

  const umzug = new Umzug({
    migrations: { glob },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  try {
    await umzug.down();
    console.log('Migrations applied');
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

runMigrations();

module.exports = runMigrations;