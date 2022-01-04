// get username from session storage
let username = sessionStorage.getItem("username");

/**
 * These variables below have a purpose to keep track of the
 * input of the username, later below it will use
 * to grab username's input and fire it up into the server.
 */
const usernameElement = document.querySelector("#username");
const changeUsernameInput = document.querySelector("#username-input");

/**
 * If the username inside session storage is null,
 * set the default value to "Anonymous"
 */
if (!username) {
  username = "Anonymous";
}

// update the ui
updateUsername(username);

/**
 * Emit joined to the server, this event is called as soon as
 * the user joined, so we can use this event to add their username.
 */
socket.emit("joined", username);

/**
 * Server fire "change-my-username" immediately after THE CURRENT USER changed their name.
 * we can use this event to render the update
 */
socket.on("change-my-username", (newUsername) => {
  // update username variable to the new one
  username = newUsername;

  // update also the session storage variable
  sessionStorage.setItem("username", newUsername);

  // render update
  updateUsername(newUsername);
});

/**
 * Server fire "someone-changed-username" immediately after SOMEONE changed their name.
 * we can use this event to render the update.
 */
socket.on("someone-changed-username", (previuousUsername, newUsername) => {
  const chatBody = document.querySelector(".chat-box-body-wrapper");
  const div = document.createElement("div");

  div.classList.add("connection-message-wrapper");
  div.innerHTML = `
      <p class="connection-message">${previuousUsername} changed username to ${newUsername}</p>
    `;

  // append child
  chatBody.appendChild(div);
});

changeUsernameInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    if (!changeUsernameInput.value) return;
    socket.emit("change-username", changeUsernameInput.value);

    // clear the input value
    changeUsernameInput.value = "";
  }
});

function updateUsername(username) {
  usernameElement.innerHTML = username;
}
