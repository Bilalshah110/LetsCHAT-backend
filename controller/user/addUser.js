require("dotenv").config();
const User = require("../../models/User");
const yup = require("yup");
const { userSchema } = require("../user/validation/userValidation");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

//ADD NEW USER
const addUser = async (req, res) => {
  const addUserValidation = userSchema.shape({
    password: yup.string().min(6).max(20).required(),
  });
  try {
    const { name, email, password } = req.body;
    await addUserValidation.validate({ name, email, password });
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(422).json({ error: "Email address already in use" });
    }
    const createdUser = await User.create({
      name,
      email,
      password,
      profileImage: req.file && {
        filename: req.file.filename,
        path: req.file.path,
        contentType: req.file.mimetype,
      },
    });
    const token = jwt.sign({ id: createdUser._id }, SECRET_KEY, {
      expiresIn: "1800s",
    });
    return res.status(201).send({ token });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(422).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addUser };
