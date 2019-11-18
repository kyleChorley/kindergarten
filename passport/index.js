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

/* GET home page */
router.get("/", (req, res) => {
  res.render("index", {
    loggedIn: req.user
  });
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/");
    }
  };
};

router.get("/profile", loginCheck(), (req, res, next) => {
  Room.find({
      owner: req.user._id
    })
    .then(rooms => {
      res.render("profile.hbs", {
        user: req.user,
        rooms: rooms
      });
    })
    .catch(err => {
      next(err);
    });
});


router.post("/kitaDetail/:kitaId/comment", loginCheck(), (req, res, next) => {
  const content = req.body.comment;
  const author = req.user._id;

  Comment.create({
      content: content,
      author: author
    })
    .then(comment => {
      return Kita.findOneAndUpdate({
          _id: req.params.kitaId
        }, {
          $push: {
            comments: comment._id
          }
        }, {
          new: true
        })
        .populate({
          path: "comments", // populates the `comments` field in the Room
          populate: {
            path: "author" // populates the `author` field in the Comment
          }
        })
        .then(kita => {
          res.json(kita.comments); // updated comments array

          // send the room's document
          // res.redirect(`/rooms/${req.params.roomId}`);
        });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;