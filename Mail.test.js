/*global test expect */
const path = require('path');
const { createKubik, createApp } = require('rubik-main/tests/helpers/creators');
const { Kubiks } = require('rubik-main');
const Mail = require('./Mail');

function init() {
  const app = createApp();
  const config = new Kubiks.Config(path.join(__dirname, './default/'));
  config.volumes.push(path.join(__dirname, './config/'));
  app.add(config);
  createKubik(Kubiks.Log, app);
  return app;
}

test('Create and add kubik', () => {
  const app = init();
  const mail = createKubik(Mail, app);
  expect(app.get('mail')).toBe(mail);
});
