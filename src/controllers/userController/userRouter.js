const express = require('express');

const createUserRouter = (userController) => {
  const router = express.Router();
  router.get('/v1', (req, res, next) => userController.listUsers(req, res, next));
  router.get('/v1/:id', (req, res, next) => userController.getUser(req, res, next));
  router.post('/v1', (req, res, next) => userController.createUser(req, res, next));
  router.put('/v1/:id', (req, res, next) => userController.updateUser(req, res, next));
  router.delete('/v1/:id', (req, res, next) => userController.deleteUser(req, res, next));
  return router;
};

module.exports = createUserRouter;