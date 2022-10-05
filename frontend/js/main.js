const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();

// get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//join chatroom

socket.emit("joinRoom", { username, room });

//get users and room info
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message text
  const msg = e.target.elements.msg.value;

  //clear the input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();

  //emitting a message to server
  socket.emit("chatMessage", msg);
});

//output the message

function outputMessage(message) {
  const div = document.createElement("div");
  console.log(message.id);
  if (socket.id === message.id) {
    div.classList.add("message-right");
  } else {
    div.classList.add("message-left");
  }
  div.innerHTML = `<p class="meta">${message.username} : <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM

function outputRoomName(room) {
  roomName.innerText = room;
}

//Add users to DOM

function outputUsers(users) {
  userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}
