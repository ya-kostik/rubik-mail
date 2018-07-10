const Rubik = require('rubik-main');

/**
 * Address of email
 * All email addresses can be plain email addresses 'foobar@example.com'
 * or with formatted name (includes unicode support) 'Ноде Майлер <foobar@example.com>'
 * @typedef {(String|Object)} EmailAddress
 * @prop {String} name — of email 'Ноде Майлер'
 * @prop {String} address — email — 'foobar@example.com'
 * @see https://nodemailer.com/message/addresses/
 */

/**
 * Attachment for mail
 * @typedef {Object} EmailAttachment
 * @see https://nodemailer.com/message/attachments/
 */

/**
 * Object with message params
 * @typedef {Object} EmailMessage
 * @prop {EmailAddress} from - The email address of the sender. All email addresses can be plain ‘sender@server.com’ or formatted ’“Sender Name” sender@server.com‘
 * @prop {(EmailAddress|Array<EmailAddress>)} to - Comma separated list or an array of recipients email addresses that will appear on the To: field
 * @prop {(EmailAddress|Array<EmailAddress>)} cc - Comma separated list or an array of recipients email addresses that will appear on the Cc: field
 * @prop {(EmailAddress|Array<EmailAddress>)} bcc - Comma separated list or an array of recipients email addresses that will appear on the Bcc: field
 * @prop {String} subject - The subject of the email
 * @prop {(String|Buffer|Stream|EmailAttachment)} text - The plaintext version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘/var/data/…’})
 * @prop {(String|Buffer|Stream|EmailAttachment)} html - The HTML version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘http://…‘})
 * @prop {Array<EmailAttachment>} attachments - An array of attachment objects. Attachments can be used for embedding images as well.
 * @see https://nodemailer.com/message/
 */

/**
 * Simple Mail Kubik
 * Use nodemailer as postman
 * @class Mail
 * @namespace Rubik
 * @extends Rubik.Kubik
 * @prop {String} name default is 'mail'
 * @prop {Array<String>} dependencies ['log', 'config']
 */
class Mail extends Rubik.Kubik {
  async up(dependencies) {
    Object.assign(this, dependencies);
    this.options = this.config.get(this.name);
    await this.applyHooks('before');
    this.initTransport();

  }

  initTransport() {
    if (this.options.type === 'smtp') return this.initSMTP();
    this._throwInvalidType();
  }

  initSMTP() {
    // To avoid storing RAM, if another transport is selected
    const nodemailer = require('nodemailer');
    this.smtp = nodemailer.createTransport(this.options.smtp);
  }

  _throwInvalidType() {
    throw new TypeError('Mail type is invalid. Possible types: smtp');
  }

  async after() {
    await this.applyHooks('after');
  }

  _checkMessage(message) {
    if (!message.from) message.from = this.options.from;
    if (!message.to) message.to = this.options.to;
    if (!message.subject) message.subject = this.options.subject;
    if (!(message.from && message.to && (message.text || message.html))) {
      throw new TypeError('message is invalid');
    }
  }

  /**
   * send mail
   * @param  {EmailMessage} message message to send
   * @return {Promise}
   */
  send(message) {
    this._checkMessage(message);
    if (this.options.type === 'smtp') return this.smtp.sendMail(message);
    this._throwInvalidType();
  }
}

Mail.prototype.name = 'mail';
Mail.prototype.dependencies = Object.freeze(['log', 'config']);

module.exports = Mail;