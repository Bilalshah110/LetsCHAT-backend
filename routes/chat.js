const { allChats } = require("../controller/chat/allChats");
const { findChat } = require("../controller/chat/findChat");
const { updateChat } = require("../controller/chat/updateChat");
const router = require("express").Router();

router.get("/", allChats);
router.get("/findchat", findChat);
router.post("/", updateChat);

module.exports = router;
