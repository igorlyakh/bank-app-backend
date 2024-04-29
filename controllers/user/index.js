const registrationUser = require('./registration');
const login = require('./login');
const logout = require('./logout');
const verifyUser = require('./verify');
const resendCode = require('./resendCode');
const sendMoney = require('./sendMoney');

module.exports = {
  registrationUser,
  login,
  logout,
  verifyUser,
  resendCode,
  sendMoney,
};
