require("dotenv").config();
const User = require("../../models/User");

//GET ALL USERS DATA
const allUsers = async (req, res) => {
  try {
    const data = await User.find().select("-password");
    if (data.length <= 0) {
      res.json({ message: "No data" });
    } else {
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {allUsers};
