require("dotenv").config();
const User = require("../models/User");
const yup = require("yup");
const bcrypt = require("bcrypt");
const { userSchema } = require("./validation/userValidation");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

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

//FIND SINGLE USER
const findUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "No user found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
    return res.status(201).send({ id: createdUser._id, token });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(422).json({ error: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

//USER LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "1800s",
    });
    res.status(201).send({ id: user._id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    try {
      const data = jwt.verify(token, SECRET_KEY);
      req.user = data;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid/Expired token" });
    }
  } else {
    return res.status(403).json({ error: "Token is missing" });
  }
}

module.exports = {
  allUsers,
  findUser,
  addUser,
  loginUser,
  updateUser,
  deleteUser,
  verifyToken,
};
