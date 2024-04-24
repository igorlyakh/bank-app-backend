const express = require('express');
const { isValidToken } = require('../middlewares');
const {
  registrationUser,
  verifyUser,
  resendCode,
} = require('../controllers/usersController');

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.put('/verification', isValidToken, verifyUser);
userRouter.put('/reverification', isValidToken, resendCode);

module.exports = userRouter;
