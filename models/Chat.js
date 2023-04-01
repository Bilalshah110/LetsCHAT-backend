const { Schema, model } = require("mongoose");
const chatSchema = new Schema({
  users: {
    type: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
      },
    ],
    required: true,
  },
  messages: [
    {
      sender: {
        _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
      },
      receiver: {
        _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
      },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
const Chat = model("Chat", chatSchema);
module.exports = Chat;
