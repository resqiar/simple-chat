/**
 * Import Express.
 * Express is the most popular NodeJS library out there.
 * There are also many other libraries like NestJS fyi.
 */
const express = require("express");
const http = require("http");

/**
 * Configure Express to create the server instance,
 * this instance will be used to serve (listen) to
 * the specific server port.
 */
const app = express();
const server = http.createServer(app);

/**
 * Socket.io configuration.
 * socket.io is a package providing bidirectional communication
 * between the server and the client using Websocket protocol.
 * @see https://socket.io
 */
const { Server } = require("socket.io");
const io = new Server(server);

/**
 * Serve static folder.
 * css, image
 */
app.use(express.static(__dirname + "/public"));

app.get("/", (_req, res) => {
  /**
   * sendFile function is used to serve a file when
   * the specific route is visited (in this case "/").
   * @see index.html
   */
  res.sendFile(__dirname + "/index.html");
});

/**
 * This array is used to keep track of the users.
 * the array will contain an object of user id and username.
 */
let userList = [];

/**
 * Socket events.
 * every change is called events, from start connection until disconnect.
 * @see https://socket.io/docs/v3/listening-to-events/
 */
io.on("connection", (socket) => {
  /**
   * When user joined at the first time (emitted from client-side).
   * @see getUsername.js
   */
  socket.on("joined", (username) => {
    /**
     * Push new object to the array.
     * The object contains id which came from socket io (unique),
     * and username which came from client side.
     */
    userList.push({
      id: socket.id,
      username: username,
    });

    // emit greeting message and the update of total user
    io.emit(
      "welcome-message",
      userList.length,
      userList.filter((user) => user.id === socket.id)
    );
  });

  /**
   * When user in the client-side decided to submit the message,
   * they fired "new-message" event and we can use that event to
   * fire another emit function to all connected user, providing username
   * and the message itself.
   */
  socket.on("new-message", (message) => {
    io.emit("new-message-server", {
      username: userList.find((user) => user.id === socket.id).username,
      message: message,
    });
  });

  /**
   * When user in the client-side decided to change the username,
   * they fired "change-username" event and we can use that event to
   * fire another emit function to all connected user.
   */
  socket.on("change-username", (newUsername) => {
    // fire to all connected user
    io.emit(
      "someone-changed-username",
      userList.find((user) => user.id === socket.id).username,
      newUsername
    );

    // update username inside the array with the new one
    userList.find((user) => user.id === socket.id).username = newUsername;

    // emit TO CURRENT USER to change their username locally
    socket.emit("change-my-username", newUsername);
  });

  /**
   * When user disconnected (leave from the site),
   * socket io fire up "disconnect" event automatically.
   */
  socket.on("disconnect", () => {
    // find in the array who is disconnected
    const disconnectedUser = userList.filter((user) => user.id === socket.id);
    // remove disconnected user from the array
    userList = userList.filter((user) => user.id !== socket.id);

    // emit to EVERYONE with the update of how many user and who is disconnected
    io.emit("someone-disconnected", userList.length, disconnectedUser);
  });
});

/**
 * Listening server in port 3000.
 * You can also change to a different port by editing
 * the variable below, for example the 3001, 3031, etc.
 */
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`server is up and listening on port:${PORT}`);
});
