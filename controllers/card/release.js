const { HttpError } = require('../../helpers');
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
    const number = Math.floor(Math.random() * (1e16 - 1e15) + 1e15);
    const cvv = Math.floor(Math.random() * 900) + 100;
    const year = (new Date().getFullYear() % 100) + 5;
    const month = new Date().getMonth() + 1;
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
