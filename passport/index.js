const passport = require('passport');
const express = require('express')
const router = express.Router();
const Kita = require("../models/Kita");
const User = require("../models/User");
const Comment = require("../models/Comment");

require('./serializers');
require('./localStrategy');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
}