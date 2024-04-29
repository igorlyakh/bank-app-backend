const { HttpError } = require('../../helpers');
const { User, Card } = require('../../models');

const close = async (req, res, next) => {
  try {
    const { user } = req;
    const { id } = req.body;
    const index = user.cards.indexOf(id);
    if (index === -1) {
      throw HttpError(404, 'Card in not found!');
    }
    user.cards.splice(index, 1);
    await User.findByIdAndUpdate(user._id, user);
    await Card.findByIdAndDelete(id);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

module.exports = close;
