const express = require('express');
const path = require('path');
const secured = require('../middleware/secured');
const router = express.Router();

const indexPath = path.join(__dirname, '../../client/index.html');

router.get('/user', secured(), (req, res, next) => {
  const { _raw, _json, ...userProfile } = req.user;
  res.sendFile(indexPath, {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: 'Profile page',
  });
});

module.exports = router;
