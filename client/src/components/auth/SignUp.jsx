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

  // const serverUrl = "https://tic-tac-toe-jade-ten.vercel.app/signup"
  const serverUrl = "http://localhost:3001/auth/signup"
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
    <div>
      <div className='flex flex-col md:flex-row bg-[#F5F5F5] min-h-screen'>
        {/* Left Section */}
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center bg-primary py-10 px-6 md:px-12'>
          <img src='/undraw_real_time_collaboration_c62i.svg' className='h-64 md:h-auto object-contain' alt='Sign Up Background' />
          <h1 className='text-2xl md:text-4xl text-black font-bold text-center mt-6'>
            Join Us and Play Live with your friends
          </h1>
        </div>

        {/* Right Section */}
        <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12'>
          <h1 className='text-xl md:text-3xl text-[#060606] font-semibold mb-4'>Tic Tac Toe</h1>

          <div className='w-full max-w-md '>
            <div className='mb-6 my-auto'>
              <h3 className='text-xl md:text-2xl font-semibold mb-2 text-black'>Sign Up</h3>
              <p className='text-base md:text-lg mb-2 text-black'>Join us by providing your information.</p>
            </div>

            <div className='w-full mb-4 flex flex-col items-center justify-center'>
              <input
                type='text'
                placeholder='First Name'
                onChange={(e) => {
                  setUser({...user, firstName: e.target.value});
                  setFirstName(e.target.value);
                }} 
                className='w-full text-black py-2 px-3 bg-transparent border-b border-black placeholder-gray-500 focus:outline-none'
              />
            </div>

            <div className='w-full mb-4'>
              <input
                type='text'
                placeholder='Last Name'
                onChange={(e) => {
                  setUser({...user, lastName: e.target.value});
                  setlastName(e.target.value);
                }} 
                className='w-full text-black py-2 px-3 bg-transparent border-b border-black placeholder-gray-500 focus:outline-none'
              />
            </div>

            <div className='w-full mb-4'>
              <input
                type='text'
                placeholder='Username'
                onChange={(e) => {
                  setUser({...user, username: e.target.value});
                  setUsername(e.target.value);
                }} 
                className='w-full text-black py-2 px-3 bg-transparent border-b border-black placeholder-gray-500 focus:outline-none'
              />
            </div>

            <div className='w-full mb-6'>
              <input
                type='password'
                placeholder='Password'
                onChange={(e) => {
                  setUser({...user, password: e.target.value});
                  setPassword(e.target.value);
                }} 
                className='w-full text-black py-2 px-3 bg-transparent border-b border-black placeholder-gray-500 focus:outline-none'
              />
            </div>

            <button className='w-full bg-purple-800 text-white rounded-md py-3 md:py-4 mb-4 md:mb-6 hover:bg-gray-900' onClick={signUp}>
              Sign Up
            </button>

            <div className='w-full flex items-center mb-4'>
              <div className='flex-grow border-t border-black'></div>
              <p className='text-sm text-black mx-4'>or</p>
              <div className='flex-grow border-t border-black'></div>
            </div>

            <p className='text-sm text-black flex items-center justify-center '>
              Already have an account ? 
              <a href={"/login"}>
                <span className='font-semibold underline cursor-pointer'> Log in</span>
              </a>
            </p>
          </div>
        </div>
    </div>
    </div>
    
  )
}

export default SignUp