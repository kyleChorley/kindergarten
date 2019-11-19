const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// GET /auth/google
router.get("/google", passport.authenticate("google", {
  scope: ["profile"]
}));


// GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    successRedirect: "/"
  })
);


router.get("/login", (req, res, next) => {
  res.render("auth/login", {
    "message": req.flash("error")
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  if (!username) {
    res.render("auth/signup.hbs", {
      message: "Username can't be empty"
    });
    return;
  }
  if (password.length < 8) {
    res.render("auth/signup.hbs", {
      message: "Password is too short"
    });
    return;
  }
  User.findOne({
      username: username
    })
    .then(found => {
      if (found) {
        res.render("auth/signup.hbs", {
          message: "Username is already taken"
        });
        return;
      }
      return bcrypt
        .genSalt()
        .then(salt => {
          return bcrypt.hash(password, salt);
        })
        .then(hash => {
          return User.create({
            username: username,
            password: hash
          });
        })
        .then(newUser => {
          console.log(username, password);
          //   authenticating the user with passport
          req.login(newUser, err => {
            if (err) next(err);
            else res.redirect("/");
          });
        });
    })
    .catch(err => {
      next(err);
    });
});

// router.post("/signup", (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   if (username === "" || password === "") {
//     res.render("auth/signup", {
//       message: "Indicate username and password"
//     });
//     return;
//   }

//   User.findOne({
//     username
//   }, "username", (err, user) => {
//     if (user !== null) {
//       res.render("auth/signup", {
//         message: "The username already exists"
//       });
//       return;
//     }

//     const salt = bcrypt.genSaltSync(bcryptSalt);
//     const hashPass = bcrypt.hashSync(password, salt);

//     const newUser = new User({
//       username,
//       password: hashPass
//     });

//     newUser.save()
//       .then(() => {
//         res.redirect("/");
//       })
//       .catch(err => {
//         res.render("auth/signup", {
//           message: "Something went wrong"
//         });
//       })
//   });
// });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;