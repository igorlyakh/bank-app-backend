const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required!'],
    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required!'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required!'],
    },
    token: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model('user', userSchema);

module.exports = User;