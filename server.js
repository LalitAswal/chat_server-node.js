const http = require("http");

const connectDB = require("./db/mongodbConnection");
const chatDetails = require("./db/chatSchema");
// const app = express();
// const app = require('./app');

const express = require("express");

const path = require("path");
const app = express();
const server = http.createServer(app);


// console.log('checking for app.js')
app.use(express.urlencoded({ extended: true })); // Specifying to use urlencoded

app.use(express.static(path.join(__dirname, "public")));

const socket = require("socket.io");
const io = socket(server);

const socketUsers = [];
// let roomLimit;
let roomList = {};

io.on("connection", (socket) => {
  socket.on("join", (username, room, roomLimit) => {
    socket.username = username;
    socketUsers.push(socket.username);
    socket.room = room;
    console.log('room details', username, room, roomLimit)
    roomList[socket.room] =  roomList[socket.room] ? (roomList[socket.room] + 1) : 1;
    socket.join(socket.room)
    // roomList.push(socket.room)
    switch (socket.room) {
      case "for 2":
        roomLimit = 2;
        break;
      case "for 3":
        roomLimit = 3;
        break;
      case "for 4":
        roomLimit = 4;
        break;
    }
    if (roomList[socket.room] > roomLimit) {
      socket.emit("message", {
        username: socketUsers,
        message: `room is full`,
      });
    } else {
        console.log('checing for broadcast', socket.room)
        // notifying other using that user A is connected
        // io.to(socket.room).broadcast.emit("message", {
        //     username: socket.username,
        //     message: `is connected`,
        // });
        
        io.to(socket.room).emit("roomUsers", {
            room: socket.room,
            username: socket.username,
        });
        // });
        console.log('checking for unfull room ' )
      io.to(socket.room).emit("message", {
        username: socket.username,
        message: `welcome to chatRoom`,
      });
    }
    console.log("socket username is ======>", socket.username);
    console.log("sockerroom is ===>", socket.room);

    // welcome message notification

    socket.on("chatMessage", (msg) => {
      console.log("checking for 77 message", msg, socket.username);
      let chatMessage = new chatDetails({
        message: msg,
        username: socket.username,
      });
      chatMessage.save();
      console.log('checking for lin 83 chatmessageroomm',socket.room)
    //   io.emit("message", {
    //     username: socket.username,
    //     message: msg,
    //   });
      io.to(socket.room).emit("message", {
        username: socket.username,
        message: msg,
     });

    });
    // when user A disconnected from the chat server
    socket.on("disconnect", () => {
      console.log("checking disconnected list", socketUsers.length);
      //   if(socketUsers.length>2)
      let checkUser = socketUsers
        .splice(
          socketUsers.findIndex((ele) => ele === socket.username),
          1
        )
        .join("");
      console.log("deleted users are ==>", checkUser);
      socket.emit("message", {
        username: checkUser,
        message: `has left the chat`,
      });
    });
  });
});

// });

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`server is running http://localhost:${PORT}/`);
});
