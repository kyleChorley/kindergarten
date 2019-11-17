const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kitaSchema = new Schema({
  name: String,
  addres: String,
  postcode: Number,
  phoneNumber: Number,
  hours: String,
  spots: {
    total: Number,
    underThree: Number,
    overThree: Number
  },
  admissionAge: Number,
  neighbourhood: String,
  email: String,
  webAddress: String,
  specials: String,
  educationalFocus: String,
  thematicFocus: String
});

const Kita = mongoose.model('Kita', kitaSchema);
module.exports = Kita;