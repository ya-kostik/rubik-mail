const path = require('path');
const { App, Kubiks } = require('rubik-main');
const Mail = require('../classes/Mail');

const test = async () => {
  // Create Rubik app
  const app = new App();
  // Setup config
  const config = new Kubiks.Config(path.join(__dirname, '../default/'));
  config.volumes.push(path.join(__dirname, '../config/'));
  app.add(config);
  // Add logs
  app.add(new Kubiks.Log());
  // Create Mail
  app.add(new Mail());
  // Up app
  await app.up();
  // Send test mail
  return app.get('mail').send({
    html: '<h1>Hi! I am OK! It is 200</h1>'
  });
}

test().
then((res) => console.dir(res, { colors: true, depth: 10 })).
catch(err => console.error('Mail send error', err));
