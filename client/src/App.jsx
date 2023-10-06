import { useState, useEffect } from 'react';
import './App.scss';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import {StreamChat} from 'stream-chat';
import {Chat} from 'stream-chat-react';
import Cookies from "universal-cookie";
import JoinGame from './components/game/JoinGame';
import axios from "axios";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

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
          <div>
          <JoinGame logout={logout}/>
          </div>
        </Chat>
      ) : (
      <Router>
        <Routes>
          <Route path='/signup' element={<SignUp setIsAuth={setIsAuth}/>} />
          <Route path='/login' element={<Login setIsAuth={setIsAuth}/>} />
        </Routes>
      </Router>
        
        
        
      )}
      
    </div>
  );
}

export default App;
