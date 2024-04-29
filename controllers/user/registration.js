const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/users');
const { HttpError, codeGenerator } = require('../../helpers');
const { smsSender } = require('../../services');
require('dotenv').config();
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
    setTimeout(async () => {
      await User.findByIdAndUpdate(result._id, { verifyCode: null });
    }, 300000);
    const payload = { id: result._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    await User.findByIdAndUpdate(result._id, { token });
    res.status(201).json({
      id: result._id,
      name: result.name,
      accountNumber,
      token,
    });
    smsSender(phone, verifyCode);
  } catch (error) {
    if (error.code === 11000) {
      next(HttpError(409, 'Email in use!'));
    }
    next(error);
  }
};

module.exports = registrationUser;
