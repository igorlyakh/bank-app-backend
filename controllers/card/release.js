const {
  HttpError,
  getNumber,
  getCvv,
  getYear,
  getMonth,
} = require('../../helpers');
const { Card, User } = require('../../models');

const release = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user.verified) {
      throw HttpError(401, 'Please verify your account!');
    }
    if (user.cards.length >= 3) {
      throw HttpError(403, 'You can have maximum 3 cards!');
    }
    const number = getNumber();
    const cvv = getCvv();
    const year = getYear();
    const month = getMonth();
    const result = await Card.create({ number, cvv, year, month });
    user.cards.push(result._id);
    await User.findByIdAndUpdate(user._id, user);
    res.status(201).json({
      number,
      cvv,
      year,
      month,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = release;
