const bcrypt = require('bcrypt');
const sendSms = require('../services/smsSender');
const User = require('../models/users');
const { HttpError, codeGenerator } = require('../helpers');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const registrationUser = async (req, res, next) => {
  try {
    const { password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = codeGenerator();
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
    sendSms(phone, verifyCode);
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
    if (req.user.verified) {
      throw HttpError(400, 'User is verified yet!');
    }
    if (verifyCode !== req.user.verifyCode) {
      throw HttpError(400, 'Wrong code!');
    }
    await User.findByIdAndUpdate(req.user._id, {
      verified: true,
      verifyCode: null,
    });
    res.json({ message: 'Verification successful!' });
  } catch (error) {
    next(error);
  }
};

const resendCode = async (req, res, next) => {
  try {
    if (req.user.verified) {
      throw HttpError(400, 'User is verified yet!');
    }
    const verifyCode = codeGenerator();
    await User.findByIdAndUpdate(req.user._id, { verifyCode });
    res.status(200).json({ message: 'Code updated!' });
    sendSms(req.user.phone, verifyCode);
  } catch (error) {
    next(error);
  }
};

const sendMoney = async (req, res, next) => {
  try {
    const { sum, target } = req.body;
    const user = req.user;
    if (user.balance < sum) {
      throw HttpError(400, 'Insufficient funds!');
    }
    if (sum <= 0) {
      throw HttpError(400, 'Invalid value!');
    }
    if (target === user.accountNumber) {
      throw HttpError(400, 'Impossible to translate for yourself!');
    }
    if (!target || !sum) {
      throw HttpError(400, 'Fill in all the fields!');
    }
    await User.findByIdAndUpdate(user._id, { $inc: { balance: -sum } });
    await User.findOneAndUpdate(
      { accountNumber: target },
      { $inc: { balance: sum } }
    );
    res.json({ message: 'You have successfully sent money!' });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, { token: null });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrationUser,
  verifyUser,
  resendCode,
  sendMoney,
  logout,
};
