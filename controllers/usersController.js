const bcrypt = require('bcrypt');
const sendSms = require('../services/smsSender');
const User = require('../models/users');
const { HttpError } = require('../helpers');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const registrationUser = async (req, res, next) => {
  try {
    const { password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(Math.random() * 9000) + 1000;
    const accountNumber = Math.floor(Math.random() * (1e16 - 1e15) + 1e15);
    const result = await User.create({
      ...req.body,
      password: hashedPassword,
      verifyCode,
      accountNumber,
    });
    const payload = { id: result._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    await User.findByIdAndUpdate(result._id, { token });
    res.status(201).json({
      id: result._id,
      name: result.name,
      accountNumber,
      token,
    });
    // sendSms(phone, verifyCode);
  } catch (error) {
    if (error.code === 11000) {
      next(HttpError(409, 'Email in use!'));
    }
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { verifyCode } = req.body;
    const user = await User.findOne({ verifyCode });
    if (!user) {
      throw HttpError(400, 'Wrong code!');
    }
    await User.findByIdAndUpdate(user._id, {
      verified: true,
      verifyCode: null,
    });
    res.json({ message: 'Verification successful!' });
  } catch (error) {
    next(error);
  }
};

module.exports = { registrationUser, verifyUser };
