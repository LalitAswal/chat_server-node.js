const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log('checking for room andusername',username, room)


const socket = io();

socket.emit('join', username, room);
// let roomSize = 2;
// let userCount = 0
// const userList =[]
// console.log('user List is ', userList)
// if(username || username != null || username != undefined){
//   console.log('user name is ',username)
//   userList.push(username)
//   userCount+=1
// }
// if(userCount<=roomSize){
//   console.log(userList, 'list og users are ===')
//   document.location.href="http://localhost:4000/";
//   prompt(' room is fully occupied')
// }


socket.on("message", (message) => {
  console.log('socket on checking ')
  console.log("checking== message line 13===", message);
  
  outputMessage(message);
  
  
  // scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

socket.on("welcome",(welcomeMessage) =>{
  console.log('checking welcome message', welcomeMessage);
  const div = document.createElement("div");


});

socket.on("broadcastMessage", (message)=>{
  console.log('checking welcome  broadcast message', message);
  const div = document.createElement("div");

})

socket.on('disconnect', (message) =>{
  console.log('user disconnected', message)
  const div = document.createElement("div");
  div.innerHTML = `
    <div class ='meta'><span></span><div>
    <p>${message}</p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
})
chatForm.addEventListener("submit", (e) => {
  // console.log("checking for even listener");
  e.preventDefault();
  
  // get message from the text
  let msg = e.target.msg.value;
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // console.log("===lalit====", msg);
  console.log('checking for message and s', username);
  socket.emit("chatMessage", msg);

  //emit message to server

  // clear type box
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  console.log('checking username',message.username);
  console.log('checking message',message.message);
  if(message.username && message.message){

      div.innerHTML = `
        <div class ='meta'><span>${message.username}</span><div>
        <p>${message.message}</p>
      `;
    }

  document.querySelector(".chat-messages").appendChild(div);
}