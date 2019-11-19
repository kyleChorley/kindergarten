const express = require('express');
const router = express.Router();
const Kita = require("../models/Kita");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

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


module.exports = router;