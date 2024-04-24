const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { HttpError } = require('../helpers');
const { User } = require('../models');

const isValidToken = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer') {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || token !== user.token || !user.token) {
      next(HttpError(401));
    }
    req.user = user;
  } catch (error) {
    next(HttpError(401));
  }
};

module.exports = isValidToken;
