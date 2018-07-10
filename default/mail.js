module.exports = {
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
