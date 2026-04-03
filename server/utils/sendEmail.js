const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // This prevents the "Connection Error" on some local machines
  }
});

  const mailOptions = {
    from: `"HR-SUPPLY" <${process.env.EMAIL_USER}>`,
    to: options.to,
    cc: options.cc || "", // Admin is CC'd only on confirmation
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;