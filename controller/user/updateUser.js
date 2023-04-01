require("dotenv").config();
const User = require("../../models/User");
const { userSchema } = require("../user/validation/userValidation");

//UPDATE USER DATA
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    await userSchema.validate({ name, email });
    const currentUser = await User.findById(req.params.userId);
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser && existingUser.email !== currentUser.email) {
      return res.status(422).json({ error: "Email address already in use" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      {
        $set: {
          name,
          email,

          profileImage: req.file && {
            filename: req.file.filename,
            path: req.file.path,
            contentType: req.file.mimetype,
          },
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: `${updatedUser.name} updated successfully` });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(422).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { updateUser };
