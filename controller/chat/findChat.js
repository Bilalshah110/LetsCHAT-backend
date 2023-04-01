const User = require("../../models/User");
const Chat = require("../../models/Chat");

const findChat = async (req, res) => {
  const { senderId, receiverId } = req.query;
  const [senderName, receiverName] = await Promise.all([
    User.findById(senderId, "name"),
    User.findById(receiverId, "name"),
  ]);

  const sender = { _id: senderId, username: senderName.name };
  const receiver = { _id: receiverId, username: receiverName.name };
  try {
    const chat = await Chat.findOne({
      "users._id": { $all: [senderId, receiverId] },
    });
    if (chat) {
      res.json(chat);
    } else {
      const newChat = await Chat.create({
        users: [sender, receiver],
        messages: [],
      });
      res.status(201).json(newChat);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { findChat };
