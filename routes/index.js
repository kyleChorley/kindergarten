const express = require('express');
const router = express.Router();
const Kita = require("../models/Kita");

/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });

router.get("/", (req, res) => {
  Kita.find({/* "5dd2713b1ca4f7fd0214ec02" */})
    .then(documents => {
      // res.send(documents);
      res.render("index.hbs");
    })
    .catch(err => {
      console.log(err);
    });
});




module.exports = router;