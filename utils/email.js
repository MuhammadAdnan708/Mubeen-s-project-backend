require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Creating transporter with port 587...');

let transporter;
let smtpConnected = false;

try {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'repaircenter896@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'mnhypejskrpnxjus'
    },
    connectionTimeout: 15000
  });

  console.log('Transporter created - port 587');

  transporter.verify((error, success) => {
    if (error) {
      console.log('SMTP connection issue:', error.message);
      smtpConnected = false;
    } else {
      console.log('SMTP connected successfully!');
      smtpConnected = true;
    }
  });
} catch (err) {
  console.log('SMTP setup failed:', err.message);
  smtpConnected = false;
}

const sendEmail = async (to, subject, html) => {
  return new Promise((resolve, reject) => {
    console.log('=== EMAIL ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    
    if (!to || !to.includes('@')) {
      console.log('Invalid email');
      resolve(false);
      return;
    }

    if (!smtpConnected) {
      console.log('SMTP not connected, email skipped');
      console.log('Would have sent to:', to);
      console.log('Subject:', subject);
      resolve(false);
      return;
    }
    
    console.log('Sending...');
    
    const mailOptions = {
      from: '"A/C Workshop" <repaircenter896@gmail.com>',
      to: to,
      subject: subject,
      html: html
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('FAILED:', error.message);
        resolve(false);
      } else {
        console.log('SUCCESS! ID:', info.messageId);
        resolve(true);
      }
    });
  });
};

module.exports = { sendEmail };
