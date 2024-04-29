const { HttpError } = require('../../helpers');
const User = require('../../models/users');

const verifyUser = async (req, res, next) => {
  try {
    const { verifyCode } = req.body;
    const { user } = req;
    if (user.verified) {
      throw HttpError(400, 'User is verified yet!');
    }
    if (verifyCode !== user.verifyCode) {
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

module.exports = verifyUser;
