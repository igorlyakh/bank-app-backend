const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/users');
const { HttpError } = require('../../helpers');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Wrong email or password!');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw HttpError(401, 'Wrong email or password!');
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      name: user.name,
      balance: user.balance,
      email: user.email,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
