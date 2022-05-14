const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // author_id: { type: mongoose.Schema.Types.ObjectId, ref: "author" },
  name: { type: String },
  price: { type: String },
  category: { type: String },
  company: { type: String },
  tag: { type: String },
  date: { type: Date, default: Date.now },
  brand: {
    name: { type: String },
  },
  // created_by: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "author",
  //   required: "This field is required.",
  // },

    userId: { type: String},
});

module.exports = mongoose.model("products", productSchema);