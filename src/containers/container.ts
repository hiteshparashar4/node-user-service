import { createContainer, asClass, asFunction, asValue } from 'awilix';
import { Sequelize, DataTypes } from 'sequelize';
import UserRepository from '@/repositories/userRepository/userRepository';
import UserService from '@/services/userService/userService';
import UserController from '@/controllers/userController/userController';
import createUserRouter from '@/controllers/userController/userRouter';
import defineUserModel from '@/models/user';

const buildContainer = async () => {
  const env = process.env.NODE_ENV || 'development';
  const isTest = env === 'test';
  const isProd = env === 'production';

  let sequelize: Sequelize;
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

  const UserModel = defineUserModel(sequelize);

  const container = createContainer();
  container.register({
    sequelize: asValue(sequelize),
    userModel: asValue(UserModel),
    userRepository: asClass(UserRepository).singleton(),
    userService: asClass(UserService).singleton(),
    userController: asClass(UserController).singleton(),
    userRouter: asFunction(({ userController }: any) => createUserRouter(userController)).singleton()
  });

  return container;
};

export default buildContainer;