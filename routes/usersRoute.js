const express = require('express');
const {
  registrationUser,
  verifyUser,
} = require('../controllers/usersController');

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.put('/verification', verifyUser);

module.exports = userRouter;
