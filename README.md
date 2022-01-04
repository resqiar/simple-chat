# Pre-requisite

- Installed NodeJS inside your machine
  It should be easy to install NodeJS on your machine.

  If you are using **linux**:

  ```bash
  sudo apt install nodejs
  ```

  if you are using **windows**:
  Download from official page [here](https://nodejs.org/en/download/)

# Installation

There are 6 easy steps to install and run the project correctly.

1.  Within the project folder, open terminal/command prompt and run the following command below.
2.  Install all the packages
    ```bash
    npm install
    ```
3.  Run the project (the app will run on http://localhost:3000 by default)
    ```bash
    npm run start
    ```
4.  Open the browser and go to http://localhost:3000
5.  Open another tab, open the same URL
6.  Here you go, you can send a message in real-time.

# Note

- The app is extendable for new features (although its hard to maintain without webpack)
- Socket.io is open-source lib, the propetiery alternatives would be Pusher.com
- The code is also available in my [here](https://github.com/resqiar/simple-chat)

# Features

- Chat in realtime
- Username saving in the session storage (should be moved to real storage)
- Change username in realtime
- User online count
- Enter to send message
- Mobile-friendly UI
