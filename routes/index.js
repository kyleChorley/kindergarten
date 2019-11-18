const express = require('express');
const router = express.Router();
const Kita = require("../models/Kita");

/* GET home page */
<<<<<<< HEAD
// router.get('/', (req, res, next) => {
//   res.render('index');
// });

router.get("/", (req, res) => {
  Kita.find()
    .then(documents => {
      // res.send(documents);
      console.log(documents);
      res.render("index.hbs", {
        location: documents
      });
    })
    .catch(err => {
      console.log(err);
    });
=======
router.get('/', (req, res, next) => {
  res.render('index', {
    loggedIn: req.user
  });
>>>>>>> 402e0e1fe88be63c131c50fd94ecacecbf22f9fe
});




module.exports = router;