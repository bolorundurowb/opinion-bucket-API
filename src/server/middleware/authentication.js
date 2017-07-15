/**
 * Created by bolorundurowb on 1/24/17.
 */

const jwt = require('jsonwebtoken');
const config = require('./../config/config');
const logger = require('./../config/logger');
const User = require('./../models/user');

const auth = function (req, res, next) {
  const token = req.headers['x-access-token'] || req.body.token;
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.status(401).send({message: 'Failed to authenticate token.'});
      } else {
        User
          .find({ _id: decoded })
          .populate('role')
          .exec(function (err, user) {
            if (err) {
              logger.error(err);
              res.status(500).send({ message: 'An error occurred when retrieving the user' });
            } else if (!user) {
              res.status(404).send({ message: 'A user with that id doesn\'t exist.' });
            } else {
              req.user = user;

              next();
            }
          });
      }
    });
  } else {
    res.status(403).send({message: 'You need to be logged in to access that information.'});
  }
};

module.exports = auth;
