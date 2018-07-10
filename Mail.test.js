/*global test expect jest */
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

test('Up kubik', async () => {
  const app = init();
  createKubik(Mail, app);
  await app.up();
});

test('Create SMTP type', async () => {
  const app = init();
  app.get('config').get('mail').type = 'smtp';
  const mail = createKubik(Mail, app);
  await app.up();
  expect(mail.smtp).toBeDefined();
});

const description = '(you should set config and check your mailbox)';

test('Send mail via SMTP' + description, async () => {
  jest.setTimeout(10000);
  const app = init();
  createKubik(Mail, app);
  await app.up();
  const promisses = [];
  promisses.push(app.get('mail').send({ text: 'This is test' }));
  promisses.push(app.get('mail').send({ html: '<h1>This is test with html</h1>' }));
  promisses.push(app.get('mail').send({
    subject: 'Custom subject test',
    text: 'This is test with custom subject'
  }));
  let addTo = app.config.get('mail').to.split('@');
  addTo = addTo[0] + '+' + 'hi' + '@' + addTo[1];
  promisses.push(app.get('mail').send({ to: addTo, text: 'This is test' }));
  await Promise.all(promisses);
});
