const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    set: (value) => value.toLowerCase(),
  },
  password: {
    type: String,
    required: true,
    set: (value) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(value, salt);
      return hash;
    },
  },
  profileImage: {
    filename: {
      type: String,
      default: "uploads/default_profile_image.jpg",
    },
    path: {
      type: String,
      default: "uploads/default_profile_image.jpg",
    },
    contentType: String,
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema);
module.exports = User;
