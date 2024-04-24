const express = require('express');
const { isValidToken } = require('../middlewares');
const {
  registrationUser,
  verifyUser,
} = require('../controllers/usersController');

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.put('/verification', isValidToken, verifyUser);

module.exports = userRouter;
