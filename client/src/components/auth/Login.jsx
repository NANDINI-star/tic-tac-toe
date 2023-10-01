import React, {useState} from 'react'
import axios from "axios"
import Cookies from "universal-cookie"

function Login(props) {
  const cookies = new Cookies();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const login = () => {
    axios.post("https://tic-tac-lugb3zorg-varunbagga19.vercel.app/login", params).then((res) => {
      const { token, userId, firstName, lastName, username}=
        res.data;

      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("username", username);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      props.setIsAuth(true);
    }).catch((error)=>{
      if(error.response.data.message)
        alert(error.response.data.message);
      else
        alert(error.response.data.error.issues[0].message)
    })
  }

  return (
    <div className='login'>
      <label>Login</label>
      <input 
        placeholder='Username' 
        onChange={(e) => {
          setUsername(e.target.value);
        }} 
      />
      <input 
        placeholder='Password' 
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }} 
      />
      <button onClick={login}>Login</button>
    </div>
  )
}

export default Login