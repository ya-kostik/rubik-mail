const Provider = require('../Provider');

/**
 * Mandrill's message object
 * @typedef {Object} MandrillMessage
 * @see https://mandrillapp.com/api/docs/messages.nodejs.html
 */

/**
 * Mandrill's ”to“ object
 * @typedef {Object} MandrillTo
 * @prop {String} [name]
 * @prop {String} email
 * @prop {String} type
 * @see https://mandrillapp.com/api/docs/messages.nodejs.html
 */

/**
 * Mandrill provider for Mail Kubik
 * @class
 */
class Mandrill extends Provider {
  /**
   * Init Mandrill library
   */
  init() {
    const { Mandrill } = require('mandrill-api/mandrill');
    this.mandrill = new Mandrill(this.config.token, this.config.debug);
  }

  /**
   * Convert address to ”to“ object
   * @param  {EmailAddress} address
   * @param  {String} [type='to'] type of ”to“ address
   * @return {MandrillTo}
   */
  converterTo(address, type = 'to') {
    address = this.parseString(address);
    return {
      email: address.address,
      name: address.name,
      type
    };
  }

  /**
   * Convert address to ”to“ array
   * @param  {Array<EmailAddress>|EmailAddress} address
   * @param  {String} [type='to'] type of ”to“ address
   * @return {MandrillTo}
   */
  converterToMany(to, type) {
    if (!to) return [];
    return Array.isArray(to)
      ? to.map((address) => this.converterTo(address, type))
      : [this.converterTo(to, type)];
  }

  /**
   * Convert message to Mandrill's message
   * @param  {EmailMessage} message
   * @return {MandrillMessage}
   */
  convertMessage({ text, html, subject, from, to, cc, bcc }) {
    from = this.parseString(from);
    to = this.converterToMany(to);
    cc = this.converterToMany(cc, 'cc');
    bcc = this.converterToMany(bcc, 'bcc');

    to = to.concat(cc, bcc);

    return {
      subject, text, html,
      from_email: from.address,
      from_name: from.name,
      to
    };
  }

  send(message) {
    message = this.convertMessage(message);

    return new Promise((resolve, reject) => {
      this.mandrill.messages.send({ message, async: true }, resolve, reject);
    });
  }
}

module.exports = Mandrill;
