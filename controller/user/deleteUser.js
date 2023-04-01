require("dotenv").config();
const User = require("../../models/User");

//DELETE USER DATA
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      return res.json({ message: `${deletedUser.name} deleted successfully` });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {deleteUser};
