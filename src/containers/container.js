const { createContainer, asClass, asFunction, asValue } = require('awilix');
const { Sequelize, DataTypes } = require('sequelize');
const UserRepository = require('../repositories/userRepository');
const UserService = require('../services/userService');
const UserController = require('../controllers/userController/userController');
const createUserRouter = require('../controllers/userController/userRouter');
const defineUserModel = require('../models/user');

const buildContainer = async () => {
  const env = process.env.NODE_ENV || 'development';
  const isTest = env === 'test';
  const isProd = env === 'production';

  let sequelize;
  if (isTest) {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
  } else {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
    const database = process.env.DB_NAME || 'appdb';
    const username = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';

    const pool = {
      max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : (isProd ? 50 : 10),
      min: process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN, 10) : 0,
      acquire: process.env.DB_POOL_ACQUIRE ? parseInt(process.env.DB_POOL_ACQUIRE, 10) : 30000,
      idle: process.env.DB_POOL_IDLE ? parseInt(process.env.DB_POOL_IDLE, 10) : 10000,
    };

    sequelize = new Sequelize(database, username, password, {
      host,
      port,
      dialect: 'mysql',
      pool,
      logging: process.env.SEQ_LOGGING === 'true' ? console.log : false
    });
  }

  await sequelize.authenticate();

  const UserModel = defineUserModel(sequelize, DataTypes);

  const container = createContainer();
  container.register({
    sequelize: asValue(sequelize),
    userModel: asValue(UserModel),
    userRepository: asClass(UserRepository).singleton(),
    userService: asClass(UserService).singleton(),
    userController: asClass(UserController).singleton(),
    userRouter: asFunction(({ userController }) => createUserRouter(userController)).singleton()
  });

  return container;
};

module.exports = buildContainer;