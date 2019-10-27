var express = require('express');
var router = express.Router();
var User = require('../model/User');
var crypto = require("crypto");
var jwt = require('jsonwebtoken');
var path = require('path');
var nodeMailer = require('nodemailer');
var bodyParser = require('body-parser');
var emailservice = require('../services/email')

const jwtsecret = 'jwtsecret';

router.get('/keys', (req, res) => {
  res.json({
    salt: crypto.randomBytes(40).toString('hex'),
    solution: crypto.randomBytes(40).toString('hex')
  });
});

router.post('/signup', (req, res) => {
  let user = new User(req.body);
  user.save();
  res.status(200).send(user);
});

router.post('/sendResetCode', (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (user) {
      user.resetCode = req.body.resetCode;
      user.save();
      sendForgetPasswordResetCode(user.email, user.resetCode);
      res.status(200).send();
    }
  });
});

router.post('/reset', (req, res) => {
  User.findOne({resetCode: req.body.resetCode}, (err, user) => {
    if (user) {
      user.problem = req.body.problem;
      user.solution = req.body.solution;
      user.resetCode = null;
      user.save();
      res.status(200).send(user.problem);
    } else {
      res.status(404).send();
    }
  });
});

router.get('/keys/:email', (req, res) => {
  User.findOne({email: req.params.email}, (err, user) => {
    if (user) {
      res.status(200).send(user.problem);
    } else {
      res.status(404).send();
    }
  });
});

router.post('/signin', (req, res) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if (!user) {
      res.status(404).send();
    }
    if (user.solution === req.body.solution) {
      res.status(200).send({
        name: user.name,
        email: user.email,
        token: jwt.sign({ userId: user.id }, jwtsecret),
        secret: 'none'
      });
    }
  });
});

function sendForgetPasswordResetCode(to, resetCode) {
  console.log('inside sendForgetPasswordResetCode function');
  let htmlbody = 'Hi<br>We received a request to reset your password. Click the link below to choose a new' +
      ' one.<br><br><br>http://localhost:3000/#/reset?code='+resetCode;
  emailservice.sendEmail(to, 'Password Reset Link- ioak.com', htmlbody, null);
}

module.exports = router;
