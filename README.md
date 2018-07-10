# rubik-mail
Simple mailer for the Rubik

## Install
Via NPM
```sh
npm install rubik-mail
```

Via Yarn
```sh
yarn add rubik-mail
```

## Usage

```javascript
const path = require('path');
const { App, Kubiks } = require('rubik-main');
const Mail = require('rubik-mail');

const app = new App();
app.add(new Kubiks.Config(path.join(__dirname, './configurations/')));
app.add(new Kubiks.Log());
app.add(new Mail());

const bootstrap = async () => {
  await app.up();
  await app.get('mail').send({
    from: 'from@example.com',
    to: 'to@example.com',
    subject: 'subject of your perfect mail',
    text: 'text of your perfect mail'
  });
}

bootstrap().
catch(err => console.error('bootstrap error!', err));
```

## Configuration

All configs for a kubik will be loaded by it's name (default is `mail`)

For example config/mail.js
```javascript
module.exports = {
  // smtp only supported at the moment
  // mandrill, mailgun and others soon
  type: 'smtp',
  smtp: {
    host: 'smtp.exaple.com',
    port: 465,
    secure: true,
    auth: {
      user: 'user',
      pass: 'password'
    }
  },
  // Will be used, if no from in in Message's object
  from: '',
  // Will be used if no to in in Message's object
  to: '',
  // Will be used if no subject in Message's object
  subject: ''
};
```
