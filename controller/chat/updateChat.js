const User = require("../../models/User");
const Chat = require("../../models/Chat");

const updateChat = async (socket, io, newMessage) => {
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
    let chat = await Chat.findById(newMessage.chatId);
    if (chat) {
      chat.messages.push({
        sender,
        receiver,
        message,
      });

      await chat.save();
      io.emit("message", chat);
      return io.to(socket.id).emit("success", chat);
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

module.exports = { updateChat };
