const Provider = require('../Provider');

class Log extends Provider {
  send(message) {
    return this.parent.log.dir(message, { colors: true, depth: 10 });
  }
}

module.exports = Log;
