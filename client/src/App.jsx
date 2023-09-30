import { useState } from 'react';
import './App.css';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import {StreamChat} from 'stream-chat';
import {Chat} from 'stream-chat-react';
import Cookies from "universal-cookie";
import JoinGame from './components/game/JoinGame';

function App() {
  const api_key = "ekv4nmgd9gaf";
  const cookies = new Cookies();
  const token = cookies.get("token")
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);

  const logout = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    client.disconnectUser();
    setIsAuth(false);
  }

  if(token) {
    client.connectUser({
      id: cookies.get("userId"),
      name: cookies.get("username"),
      firstName: cookies.get("firstName"),
      lastName: cookies.get("lastName"),
      hashedPassword: cookies.get("hashedPassword"),
      },
      token
    ).then(() => {
      setIsAuth(true);
    });
  }

  return (
    <div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <button onClick={logout}>Log out</button>
        </Chat>
      ) : (
        <>
          <SignUp setIsAuth={setIsAuth}/>
          <Login setIsAuth={setIsAuth}/>
        </>
        
      )}
      
    </div>
  );
}

export default App;
