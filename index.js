require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;
const DB_CONNECTION = process.env.DB_CONNECTION;
const cors = require("cors");
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");
const path = require("path");

const { newChatOrAddMsg } = require("./controller/chatController");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("message", (newMessage) => {
    newChatOrAddMsg(socket, io, newMessage);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());

// CONNECTING TO DATABASE
mongoose
  .connect(DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log(error));

// CONNECTING ROUTES
app.use("/users", userRoute);
app.use("/chats", chatRoute);

// CONNECTING TO SERVER
server.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
