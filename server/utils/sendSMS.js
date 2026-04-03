const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      messagingServiceSid: process.env.TWILIO_MSG_SERVICE_SID,
      to: to // Must be in E.164 format (e.g., +4915214750817)
    });
    console.log("SMS sent! SID:", response.sid);
  } catch (error) {
    console.error("Twilio Error:", error.message);
  }
};

module.exports = sendSMS;