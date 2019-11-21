const express = require("express");
const router = express.Router();
const Kita = require("../models/Kita");
const Comment = require("../models/Comment");
const User = require("../models/User");
/* GET home page */

// router.get("/map", (req, res, next) => {
//   res.render("map.hbs");
// });

router.get("/api/kitas", (req, res, next) => {
  Kita.find()
    .then(documents => {
      res.json(documents);
    })
    .catch(err => {
      next(err);
    });
});

router.get("/", (req, res, next) => {
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
  console.log(req.user);
  Comment.find({
      author: req.user._id
    })
    .populate("kita")
    .then(response => {
      res.render("profile.hbs", {
        comments: response,
        loggedIn: req.user,
        // showDelete: req.comment.author.toString() === req.user._id.toString() ||
        //   req.user.role === "admin",
        user: req.user,
        kitas: req.user.kitas
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/profile/:commentId/delete", (req, res) => {
  const id = req.params.commentId;
  Comment.findByIdAndDelete(id)
    .then(comment => {
      console.log(comment);
      res.redirect("/profile");
    })
    .catch(err => {
      next(err);
    });
});


router.get('/profile/:commentId/delete', (req, res) => {
  const id = req.params.commentId
  Comment.findByIdAndDelete(id).then(comment => {
    console.log(comment)
    res.redirect('/profile')
  }).catch(err => {
    next(err);
  });
})

router.get("/kita/:kitaId", (req, res, next) => {

  Kita.findById(req.params.kitaId).populate({
      path: "comments", // populates the `comments` field in the Kita
      populate: {
        path: "author", // populates the `author` field in the Comment
        loggedIn: req.user

      }
    })
    .then(kita => {
      res.render("kitaDetail.hbs", {
        kita: kita,
        loggedIn: req.user
      });
    })
    .catch(err => {
      next(err);
    });
});

router.post("/kitaDetail/:kitaId/comment", loginCheck(), (req, res, next) => {
  const content = req.body.comment;
  const author = req.user._id;
  console.log("req.user", author)
  Comment.create({
      content: content,
      author: author,
      kita: req.params.kitaId,
      loggedIn: req.user
    })
    .then(comment => {
      console.log("backend comment before populate", comment)
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
          path: "comments", // populates the `comments` field in the Kita
          populate: {
            path: "author" // populates the `author` field in the Comment
          }
        })
        .then(something => {
          console.log("Kita Route", something);
          res.json(something.comments); // updated comments array
        });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;