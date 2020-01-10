const Rubik = require('rubik-main');
const path = require('path');

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
  /**
   * Up kubik
   * @param  {Object} dependencies
   */
  async up(dependencies) {
    Object.assign(this, dependencies);
    this.options = this.config.get(this.name);
    await this.applyHooks('before');
    await this.initTransport();
  }

  /**
   * Create mail tranport provider
   * @param  {String} type    of transport
   * @param  {Object} config  of transport
   * @param  {Object} options of Mail
   * @return {Promise<Provider>}
   */
  async createProvider(type, config = {}, options = {}) {
    const name = this.providers[type];
    if (!name) return this._throwInvalidType();

    const Provider = require(path.join(__dirname, './Providers/' + name));
    if (!Provider) return this._throwInvalidType();

    const provider = new Provider(config, this, options);
    await provider.init();

    return provider;
  }

  async initTransport() {
    const type = this.options.type;
    const config = this.options[type];
    this.provider = await this.createProvider(
      type, config, this.options
    );
  }

  _throwInvalidType() {
    throw new TypeError('Mail type is invalid. Possible types: smtp, log');
  }

  async after() {
    await this.applyHooks('after');
  }

  /**
   * send mail
   * @param  {EmailMessage} message message to send
   * @return {Promise}
   */
  send(message, provider = this.provider) {
    provider.checkMessage(message);
    return provider.send(message);
  }
}

Mail.prototype.name = 'mail';
Mail.prototype.dependencies = Object.freeze(['log', 'config']);
Mail.prototype.providers = Object.freeze({
  mandrill: 'Mandrill',
  smtp: 'SMTP',
  log: 'Log'
});

module.exports = Mail;
