const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {type: String},
  address: {
    street: String,
    city: String,
    zipcode: Number
  },
  tasks: {
    id: String,
    title: String,
    completed: Boolean
  },
  posts: {
    id: String,
    title: String,
    body: String
  }
});

const User = mongoose.model('user', userSchema, 'users')

module.exports = User;
