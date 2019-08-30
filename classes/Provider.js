const isString = require('lodash/isString');

class Provider {
  constructor(config, parent, options) {
    this.config = config;
    this.parent = parent;

    this.options = options;
  }

  init() {}

  parseString(address) {
    if (!isString(address)) return address;

    const reg = /^(.*?)<(.+?)>$/;
    const match = address.match(reg);
    if (!match) return { address };

    const out = { address: match[2].trim() };

    const name = match[1].trim();
    if (name) out.name = name;

    return out;
  }

  send(/* message */) {
    throw new ReferenceError('Provider send method is not implemented');
  }

  checkMessage(message) {
    if (!message) throw new TypeError('message is not defined');
    if (!message.from) message.from = this.options.from;
    if (!message.to) message.to = this.options.to;
    if (!message.subject) message.subject = this.options.subject;
    if (!(message.from && message.to && (message.text || message.html))) {
      throw new TypeError('message is invalid');
    }
  }
}

module.exports = Provider;
