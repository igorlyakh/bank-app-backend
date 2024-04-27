const express = require('express');
const { isValidToken } = require('../middlewares');
const {
  registrationUser,
  verifyUser,
  resendCode,
  sendMoney,
  logout,
} = require('../controllers/usersController');

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.put('/verification', isValidToken, verifyUser);
userRouter.put('/reverification', isValidToken, resendCode);
userRouter.post('/send', isValidToken, sendMoney);
userRouter.post('/logout', isValidToken, logout);

module.exports = userRouter;
