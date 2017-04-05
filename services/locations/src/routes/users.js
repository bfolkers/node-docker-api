const express = require('express');
const localAuth = require('../auth/local');
const authHelpers = require('../auth/_helpers');

const router = express.Router();

router.post('/register', (req, res) => {
  return authHelpers.createUser(req, res)
  .then((user) => { return localAuth.encodeToken(user[0]); })
  .then((token) => {
    res.status(200).json({
      status: 'success',
      token,
    });
  })
  .catch(() => {
    res.status(500).json({
      status: 'error',
    });
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  return authHelpers.getUser(username)
  .then((response) => {
    authHelpers.comparePass(password, response.password);
    return response;
  })
  .then((response) => { return localAuth.encodeToken(response); })
  .then((token) => {
    res.status(200).json({
      status: 'success',
      token,
    });
  })
  .catch(() => {
    res.status(500).json({
      status: 'error',
    });
  });
});

router.get('/user', authHelpers.ensureAuthenticated, (req, res) => {
  res.status(200).json({
    status: 'success',
  });
});

module.exports = router;
