/**
 * Server fire "welcome-message" immediately after someone joined.
 * we can use this event to render who is connected and update
 * how many users available in the room.
 */
socket.on("welcome-message", (userListLength, user) => {
  renderConnectionMessage(true, user[0].username);
  renderUserLength(userListLength);
});

/**
 * Server fire "someone-disconnected" immediately after someone disconnected.
 * we can use this event to render who leave the room and update
 * how many users available.
 */
socket.on("someone-disconnected", (userListLength, user) => {
  renderConnectionMessage(false, user[0].username);
  renderUserLength(userListLength);
});

/**
 * These variables below have a purpose to keep track of the
 * input of the message and send button, later below it will use
 * to grab user's input and fire it up into the server.
 */
const chatInput = document.getElementById("input");
const sendButton = document.getElementById("send-btn");

input.addEventListener("keyup", function (event) {
  // when user enter
  if (event.key === "Enter") {
    sendButton.click();
  }
});

sendButton.addEventListener("click", () => {
  if (!chatInput.value) return;

  // emit to the server "new-message" event, providing the actual message
  socket.emit("new-message", chatInput.value);

  // clear input field value
  clearInput();
});

/**
 * Server fire "new-message-server" immediately after someone fire "new-message" event.
 * we can use this event to render the message and the username.
 */
socket.on("new-message-server", (data) => {
  // render chat
  renderChatItem(data.username, data.message);

  // automatically scroll to the bottom
  scrollToBottom();
});

function clearInput() {
  chatInput.value = "";
}

function scrollToBottom() {
  const chatBody = document.querySelector(".chat-box-body-wrapper");
  chatBody.scrollTo(0, chatBody.scrollHeight);
}

function renderChatItem(username, message) {
  const chatBody = document.querySelector(".chat-box-body-wrapper");

  const div = document.createElement("div");
  div.classList.add("chat-item");
  div.innerHTML = `
    <p class="chat-item-username">${username}</p>
    <p class="chat-item-message">${message}</p>
    <p class="chat-item-timestamp">${new Date().getHours()}:${new Date().getMinutes()}</p>
  `;

  // append child
  chatBody.appendChild(div);
}

function renderConnectionMessage(isJoined, username) {
  const chatBody = document.querySelector(".chat-box-body-wrapper");
  const div = document.createElement("div");

  if (isJoined) {
    div.classList.add("connection-message-wrapper");
    div.innerHTML = `
      <p class="connection-message">${
        username ? username : "Anonymous"
      } Connected</p>
    `;
  } else {
    div.classList.add("connection-message-wrapper");
    div.innerHTML = `
      <p class="connection-message">${
        username ? username : "Anonymous"
      } Disconnected</p>
    `;
  }

  // append child
  chatBody.appendChild(div);
}

function renderUserLength(length) {
  const element = document.querySelector("#people-online-number");
  element.innerHTML = length;
}
