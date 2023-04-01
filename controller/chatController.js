const User = require("../models/User");
const Chat = require("../models/Chat");

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

const newChatOrAddMsg = async (socket, io, newMessage) => {
  const { senderId, receiverId, message } = newMessage;

  const [senderName, receiverName] = await Promise.all([
    User.findById(senderId, "name"),
    User.findById(receiverId, "name"),
  ]);

  if (!senderName || !receiverName) {
    return io.to(socket.id).emit("error", "Invalid sender or receiver ID");
  }

  const sender = { _id: senderId, username: senderName.name };
  const receiver = { _id: receiverId, username: receiverName.name };

  try {
    let existingChat = await Chat.findOne({
      "users._id": { $all: [senderId, receiverId] },
    });
    if (existingChat) {
      existingChat.messages.push({
        sender,
        receiver,
        message,
      });

      await existingChat.save();
      io.emit("message", existingChat);
      return io.to(socket.id).emit("success", existingChat);
    } else {
      const newChat = new Chat({
        users: [sender, receiver],
        messages: [
          {
            sender,
            receiver,
            message,
          },
        ],
      });
      await newChat.save();
      io.emit("message", newChat);
      return io.to(socket.id).emit("message", newChat);
    }
  } catch (error) {
    socket.emit("messageError", "Error sending message: " + error.message);
  }
};

module.exports = { allChats, findChat, newChatOrAddMsg };
