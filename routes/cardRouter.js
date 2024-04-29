const express = require('express');
const { release, close } = require('../controllers/card');
const { isValidId, isValidToken } = require('../middlewares');

const cardRouter = express.Router();

cardRouter.post('/release', isValidToken, release);
cardRouter.post('/close', isValidToken, isValidId, close);

module.exports = cardRouter;
