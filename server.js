const http = require('http');

const connectDB = require('./db/mongodbConnection');
const chatDetails = require('./db/chatSchema');
// const app = express();
// const app = require('./app');

const express = require('express')

const path = require("path");
const app = express();
const server = http.createServer(app);

// console.log('checking for app.js')
app.use(express.urlencoded({ extended: true })) // Specifying to use urlencoded

app.use(express.static(path.join(__dirname , "public")));


const socket = require("socket.io");
const io  = socket(server);


const usersInRooms = {}; 

io.on('connection', socket =>{

    socket.on('join',(username, room)=>{
      socket.join(room)
      socket.username = username;
      // socketUsers.push(socket.username)
      socket.room = room;
      console.log(' users are ==>', room)
      console.log('socket username is ======>',socket.username)
      console.log('sockerroom is ===>',socket.room)
      // if (roomUsers.length >= 2) { // limit the number of users to 2
      //   socket.emit( 'message',{
      //     username:socket.username,
      //     message:` welcome to chatRoom`});
      //   return;
      // }

      // socket.username = username;
      // socket.room = room;
      // roomUsers.push(username);
      // usersInRooms[room] = roomUsers;
      // console.log(`${username} joined the room ${room}`);
      // socket.broadcast.to(room).emit('message',{
      //   username:socket.username,
      //   message:` is connected`});
    });
      // welcome message notification 
        socket.emit('message',{
          username:socket.username,
          message:` welcome to chatRoom`});
        
        // notifying other using that user A is connected
        socket.broadcast.emit('message',{
          username:socket.username,
          message:` is connected`});
        
        
        socket.on('chatMessage', (msg) =>{
          // console.log('checking for message',msg, socket.username);
          let chatMessage =  new  chatDetails({message:msg, username:socket.username});
          chatMessage.save();
          io.emit('message',{
            username:socket.username,
            message:msg,
          });
        })
        // when user A disconnected from the chat server
        socket.on('disconnect', ()=>{
        const roomUsers = usersInRooms[socket.room] || [];
        const index = roomUsers.indexOf(socket.username);
        if (index > -1) {
        roomUsers.splice(index, 1);
        usersInRooms[socket.room] = roomUsers;
        console.log(`${socket.username} left the room ${socket.room}`);
        socket.broadcast.to(socket.room).emit('message', { message: `${socket.username} left the chat` });
        }
      })
    
        })

// });


const PORT = 4000;

server.listen(PORT, ()=>{

    console.log(`server is running http://localhost:${PORT}/`);
})

