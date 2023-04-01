const { allChats,findChat, newChatOrAddMsg } = require("../controller/chatController");
const router = require("express").Router();

router.get("/", allChats);
router.get("/findchat", findChat);
router.post("/", newChatOrAddMsg);

module.exports = router;
