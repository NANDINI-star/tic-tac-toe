# tic-tac-toe with chat.
Here's a video of the game: https://drive.google.com/file/d/19iR8hlL4BjqGy_S98Hfi3OQLi0k3MSA-/view?usp=sharing

A tic-tac-toe game, that you can play live with your friends. You can also chat with the rival player at the same time.
## Tech used
- [StreamAPI](https://getstream.io/) - to create a live channel
- Frontend: ReactJS, TailwindCSS
- Backend: ExpressJS, NodeJS, Zod validation
- Database: MongoDB
- Package manager: yarn

## Project Structure
- client/: contains frontend code, tailwind.config file and the packages installed for the same.
- client/public: This directory holds SVG files. It serves as a repository for static assets accessible to both the frontend and the backend.
- client/src/components/auth: Contains the components for Login and Signup page.
- client/src/components/game: Contains all the components that we see once we pass the authentication and enter the game. It has game related components and winning patterns.
- client/src: Contains the main entry-point component(App.jsx) of the application and the main stylesheet of the app.
- server/: Contains the entry-point of the server, and contains the list of packages used. `I also added zod validation here to validate inputs, then I tried deploying it, deployment was failing with zod since it is typescript first. The code for zod validate is still intact but commented.`
- server/db: consists of the schemas defined for CHANNEL and USERS in mongoDB.
- server/routes: contains the routes for auth and channels.

## API Routes explained
All these requests send and retrieve data from MongoDB
- /auth/signup : POST request, posts user details to the server and returns the json response of the same.
- /auth/login : POST request, posts username and password only to authenticate the user.
- /channel/channel-data: GET request, return the channel data response in json format.
- /channel/save-channel-data: POST request, allows us to save the channel data in mongoDB.

## Completed Features
1. Creating Account: Users can sign up and create their accounts.
2. Play Live: Users can play live with another player. It's a multiplayer game.
3. Chat Live: Chat with the rival player, while you're playing the game.
4. Reset Board: You can reset the board.
5. Save Game: You can save the current state of your board.
6. Leave game: You can leave the game anytime you want.

## Planned Features
1. Retrieve the game: Retrieve the saved game state, to resume the game.
2. Score Board: Score board currently is not consistent for both the user screens, if a player wins, only that player gets to know the updated score.
   
