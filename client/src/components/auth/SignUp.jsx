import React, { useState } from 'react'
import axios from "axios"
import Cookies from "universal-cookie"
// import { errorMessage } from 'stream-chat-react/dist/components/AutoCompleteTextarea/utils';

function SignUp(props) {
  const cookies = new Cookies();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setlastName] = useState(null);
  
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('firstName', firstName);
  params.append('lastName', lastName);

  const serverUrl = "https://tic-tac-toe-jade-ten.vercel.app/signup"
  const signUp = () => {
    axios.post(serverUrl, params).then((res) => {

      if(res.status === 200) {
        const { token, userId, firstName, lastName, username, hashedPassword}=
        res.data;
        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("username", username);
        cookies.set("firstName", firstName);
        cookies.set("lastName", lastName);
        cookies.set("hashedPassword", hashedPassword);
        props.setIsAuth(true);
      }
      
    }).catch((error) => {
      if(error.response.data.message)
        alert(error.response.data.message);
      else if(error.response.data.error.issues[0].message)
        alert(error.response.data.error.issues[0].message)
      else 
        alert(error);
    
    })
  }

  return (
    <>
      <div className='signUp'>
        <label> Sign Up</label>
        <input 
          placeholder='First Name' 
          onChange={(e) => {
            setUser({...user, firstName: e.target.value});
            setFirstName(e.target.value);
          }} 
        />
        <input 
          placeholder='Last Name' 
          onChange={(e) => {
            setUser({...user, lastName: e.target.value});
            setlastName(e.target.value);
          }} 
        />
        <input 
          placeholder='Username' 
          onChange={(e) => {
            setUser({...user, username: e.target.value});
            setUsername(e.target.value);
          }} 
        />
        <input 
          placeholder='Password' 
          type="password"
          onChange={(e) => {
            setUser({...user, password: e.target.value});
            setPassword(e.target.value);
          }} 
        />
      </div>
      <div>
        <button className='signUp' onClick={signUp}>
          SignUp
        </button>
      </div>
      
    </>
    
  )
}

export default SignUp