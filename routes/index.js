const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
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

module.exports = router;