const { model, Schema } = require('mongoose');

const cardSchema = new Schema(
  {
    number: {
      type: Number,
      unique: true,
      default: null,
    },
    cvv: {
      type: Number,
      default: null,
    },
    month: {
      type: Number,
      default: null,
    },
    year: {
      type: Number,
      default: null,
    },
  },
  { versionKey: false }
);

const Card = model('card', cardSchema);

module.exports = Card;
