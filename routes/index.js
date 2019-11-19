const express = require("express");
const router = express.Router();
const Kita = require("../models/Kita");
const Comment = require("../models/Comment")
const User = require("../models/User");
/* GET home page */


// router.get("/", (req, res) => {
//   Kita.find()
//     .then(documents => {
//       // res.send(documents);
//       console.log(documents);
//       res.render("index.hbs", {
//         location: documents
//         loggedIn: req.user
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });


// router.get('/map,' (req, res, next) => {
//   res.render('index');
// });

router.get("/map", (req, res, next) => {
  res.render("map.hbs");
});

router.get("/api/kitas", (req, res, next) => {
  // Kita.find()
  //   .then(documents => {
  //     res.json(documents);
  //   })
  //   .catch(err => {
  //     next(err);
  //   });

  Kita.findById("5dd3e3558ec2d852f856b6db")
    .then(documents => {
      res.json(documents)
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



router.get('/profile/:commentId/delete', (req, res) => {
  const id = req.params.commentId
  Comment.findByIdAndDelete(id).then(comment => {
    console.log(comment)
    res.redirect('/profile')
  }).catch(err => {
    next(err);
  });
})

router.get("/kita/:kitaId", loginCheck(), (req, res, next) => {

  Kita.findById(req.params.kitaId)
    .then(kita => {
      res.render('kitaDetail.hbs', {
        kita: kita
      })

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

// router.get("/kitaDetail/:kitaId/delete", loginCheck(), (req, res, next) => {
//   const query = {
//     _id: req.params.kitaId
//   };

//   if (req.user.role !== "admin") {
//     query.owner = req.user._id;
//   }

//   // if the user that made the request is the one that created the room:
//   // delete the comment where the `_id` of the  is the one from the params and the `owner` of the room is the user who made the request

//   Comment.deleteOne(query)
//     .then(() => {
//       res.redirect("/kitaDetail/:kitaId");
//     })
//     .catch(err => {
//       next(err);
//     });
// });


module.exports = router;