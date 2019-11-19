const express = require("express");
const router = express.Router();
const Kita = require("../models/Kita");
const Comment = require("../models/Comment")
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


// router.get("/api/kitas", (req, res, next) => {
//   // Kita.find()
//   //   .then(documents => {
//   //     res.json(documents);
//   //   })
//   //   .catch(err => {
//   //     next(err);
//   //   });

//   Kita.findById("5dd3e3558ec2d852f856b6db")
//     .then(documents => {
//       res.json(documents)
//     })
//     .catch(err => {
//       next(err);
//     });
// });

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
        user: req.user,
        kitas: req.user.kitas
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/:kitaId", loginCheck(), (req, res, next) => {
  Kita.findById(req.params.kitaId)
    .populate({
      path: "comments", // populates the `comments` field in the Kita
      populate: {
        path: "author" // populates the `author` field in the Comment
      }
    })
    .then(kita => {
      console.log(kita);
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

  Comment.create({
      content: content,
      author: author,
      kita: req.params.kitaId
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
          path: "comments", // populates the `comments` field in the Kita
          populate: {
            path: "author" // populates the `author` field in the Comment
          }
        })
        .then(something => {
          console.log(something);
          res.json(something.comments); // updated comments array
        });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;