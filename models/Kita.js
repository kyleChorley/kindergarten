const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kitaSchema = new Schema({
  name: String,
  einrichtungsart: String,
  traegerart: String,
  traegerart2: String,
  addresse: String,
  postleitzahl: Number,
  stadt: String,
  viertel: String,
  telefon: String,
  email: String,
  webAddress: String,
  angebote: String,
  paedagogischeSchwerpunkte: String,
  oeffnungszeiten: String,
  angeboten: String,
  unter3Jahre: String,
  ueber3Jahre: String,
  fruehestesAufnahmealterInMonaten: String,
  altersmischung: String,
  paedagogischeAnsaetze: String,
  thematischeSchwerpunkte: String
});


const Kita = mongoose.model('Kita', kitaSchema, "kitaBerlin");
module.exports = Kita;