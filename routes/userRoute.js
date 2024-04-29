const express = require('express');
const { isValidToken } = require('../middlewares');
const {
  registrationUser,
  login,
  logout,
  verifyUser,
  resendCode,
  sendMoney,
} = require('../controllers/user');

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/login', login);
userRouter.post('/logout', isValidToken, logout);
userRouter.put('/verification', isValidToken, verifyUser);
userRouter.put('/reverification', isValidToken, resendCode);
userRouter.post('/send', isValidToken, sendMoney);

module.exports = userRouter;
