var User = require('../models/user');
var Circle = require('../models/circle');
var spotify = require('../config/spotifyApiHelper');
var locus = require('locus');

var indexCircle = function(req, res) {
  Circle.find({}, function(err, records) {
    res.json(records);
  });
};

var indexUser = function(req, res) {
  User.find({}, function(err, records) {
    res.json(records);
  });
};

module.exports = {
  indexCircle: indexCircle,
  indexUser: indexUser
}
