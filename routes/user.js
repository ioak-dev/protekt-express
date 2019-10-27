var express = require('express');
var router = express.Router();
var User = require('../model/User');

router.get('/preferences', (req, res) => {
  User.findById(req.auth.userId, (err, data) => {
    res.status(200).send(data.preferences);
  })  
});

router.put('/preferences', (req, res) => {
  User.findByIdAndUpdate(req.auth.userId, {preferences: req.body}, {new: true}, (err, user) => {
    res.status(201).send(user.preferences);  
  })
});

router.put('/details', (req, res) => {
  User.findByIdAndUpdate(req.auth.userId, {...req.body}, {new: true}, (err, user) => {
    res.status(201).send({});  
  })
});

module.exports = router;
