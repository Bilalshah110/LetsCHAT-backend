const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const { allUsers } = require("../controller/user/allUsers");
const { findUser } = require("../controller/user/findUser");
const { addUser } = require("../controller/user/addUser");
const { loginUser } = require("../controller/user/loginUser");
const { updateUser } = require("../controller/user/updateUser");
const { deleteUser } = require("../controller/user/deleteUser");
const { verifyToken } = require("../controller/user/verifyToken");

router.get("/", allUsers);
router.get("/finduser/:userId", findUser);
router.post("/adduser", upload.single("photo"), addUser);
router.post("/loginuser", loginUser);
router.put(
  "/updateuser/:userId",
  upload.single("photo"),
  verifyToken,
  updateUser
);
router.delete("/deleteuser/:userId", verifyToken, deleteUser);

module.exports = router;
