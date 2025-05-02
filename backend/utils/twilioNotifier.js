const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

function formatUKPhoneNumber(number) {
  const numeric = number.replace(/\D/g, '');
  if(numeric.length === 11 && numeric[0] === '0'){
    return '+44' + numeric.slice(1);
  }
  return number;
}

const sendSMS = async (to, message) => {
  try {
    const formattedTo = formatUKPhoneNumber(to);
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo
    });
    console.log("SMS sent:", result.sid);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

module.exports = { sendSMS, formatUKPhoneNumber };
