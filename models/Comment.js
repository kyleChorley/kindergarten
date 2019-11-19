const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  kita: {
    type: Schema.Types.ObjectId,
    ref: 'Kita'
  }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;