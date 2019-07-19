const express = require('express');
const secured = require('../middleware/secured');
const path = require('path');
const router = express.Router();

const indexPath = path.join(__dirname, '../../client/index.html');

router.get('/user', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  res.sendFile(indexPath, {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: 'Profile page'
  });
});

module.exports = router;