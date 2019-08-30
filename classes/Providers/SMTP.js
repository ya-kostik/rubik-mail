const Provider = require('../Provider');

class SMTP extends Provider {
  init() {
    const nodemailer = require('nodemailer');
    this.nodemailer = nodemailer.createTransport(this.config);
  }

  async send(message) {
    this.checkMessage(message);
    return this.nodemailer.sendMail(message);
  }
}

module.exports = SMTP;
