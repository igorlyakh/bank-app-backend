const express = require('express');
const isValidToken = require('../middlewares/isValidToken');
const { release, close } = require('../controllers/card');

const cardRouter = express.Router();

cardRouter.post('/release', isValidToken, release);
cardRouter.post('/close', isValidToken, close);

module.exports = cardRouter;
