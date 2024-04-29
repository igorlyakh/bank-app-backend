const { HttpError } = require('../../helpers');
const { User } = require('../../models');

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

module.exports = sendMoney;
