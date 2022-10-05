const express = require("express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/user");

require("dotenv/config");

const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
const io = socketio(server);

//connction to the database

async function connect() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("connected");
  } catch (err) {
    console.error(err);
  }
}
connect();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "frontend")));

//use when a user is live
const botName = "chatRoom Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ username, room }) => {
    const user = await userJoin(socket.id, username, room);
    console.log(socket.id);
    socket.join(user.room);
    // console.log(user.id);
    // welcome current user
    socket.emit(
      "message",
      formatMessage(socket.id, botName, "welcome to chat room")
    );

    //broadcast to other users

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(
          socket.id,
          botName,
          `${user.username} is joined in the chat`
        )
      );

    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: await getRoomUsers(user.room),
    });
  });

  //listen for chat message
  socket.on("chatMessage", async (msg) => {
    const user = await getCurrentUser(socket.id);
    io.to(user.room).emit(
      "message",
      formatMessage(socket.id, user.username, msg, user.id)
    );
  });

  //when the user diconnect
  socket.on("disconnect", async () => {
    console.log("this ", socket.id);
    const user = await userLeave(socket.id);
    console.log("got it", user);
    if (user) {
      console.log("got it here", user);
      await io
        .to(user.room)
        .emit(
          "message",
          formatMessage(
            socket.id,
            botName,
            `${user.username} has left the chat`
          )
        );

      //send users and room info
      await io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: await getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => console.log(`server is running on ${PORT}`));
