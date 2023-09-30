import React, { useState } from 'react'
import axios from "axios"
import Cookies from "universal-cookie"

function SignUp(props) {
  const cookies = new Cookies();
  const [user, setUser] = useState(null);
  

  const signUp = () => {
    axios.post("http://localhost:3001/signup", user).then((res) => {
      const { token, userId, firstName, lastName, username, hashedPassword}=
        res.data;
      console.log(res.data);
      cookies.set("token", token);
      cookies.set("userId", userId);
      cookies.set("username", username);
      cookies.set("firstName", firstName);
      cookies.set("lastName", lastName);
      cookies.set("hashedPassword", hashedPassword);
      props.setIsAuth(true);
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
          }} 
        />
        <input 
          placeholder='Last Name' 
          onChange={(e) => {
            setUser({...user, lastName: e.target.value});
          }} 
        />
        <input 
          placeholder='Username' 
          onChange={(e) => {
            setUser({...user, username: e.target.value});
          }} 
        />
        <input 
          placeholder='Password' 
          type="password"
          onChange={(e) => {
            setUser({...user, password: e.target.value});
          }} 
        />
      </div>
      <div>
        <button onClick={signUp}>
          {console.log("hh")}
          Signup
        </button>
      </div>
      
    </>
    
  )
}

export default SignUp