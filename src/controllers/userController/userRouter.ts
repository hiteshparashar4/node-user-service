import express from 'express';
import type UserController from '@/controllers/userController/userController';

const createUserRouter = (userController: UserController) => {
  const router = express.Router();
  router.get('/', (req, res, next) => userController.listUsers(req, res, next));
  router.get('/:id', (req, res, next) => userController.getUser(req, res, next));
  router.post('/', (req, res, next) => userController.createUser(req, res, next));
  router.put('/:id', (req, res, next) => userController.updateUser(req, res, next));
  router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));
  return router;
};

export default createUserRouter;