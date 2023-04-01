const Chat = require("../../models/Chat");

const allChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    if (chats.length <= 0) {
      return res.status(404).json({ message: "No chats" });
    }
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { allChats };
