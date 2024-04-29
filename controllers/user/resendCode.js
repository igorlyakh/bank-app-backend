const { codeGenerator, HttpError } = require('../../helpers');
const User = require('../../models/users');
const { smsSender } = require('../../services');

const resendCode = async (req, res, next) => {
  try {
    const { user } = req;
    if (user.verified) {
      throw HttpError(400, 'User is verified yet!');
    }
    const verifyCode = codeGenerator();
    await User.findByIdAndUpdate(user._id, { verifyCode });
    res.status(200).json({ message: 'Code updated!' });
    setTimeout(async () => {
      await User.findByIdAndUpdate(user._id, { verifyCode: null });
    }, 300000);
    smsSender(user.phone, verifyCode);
  } catch (error) {
    next(error);
  }
};

module.exports = resendCode;
