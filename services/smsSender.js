require('dotenv').config();

const { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_NUMBER } = process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const smsSender = (number, code) => {
  client.messages.create({
    body: `Your verify code: ${code}`,
    from: TWILIO_NUMBER,
    to: number,
  });
};

module.exports = smsSender;
