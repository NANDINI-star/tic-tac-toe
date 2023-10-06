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

  // const serverUrl = "https://tic-tac-toe-jade-ten.vercel.app/login"
  const serverUrl = "http://localhost:3001/auth/login"

  const login = () => {
    axios.post(serverUrl, params).then((res) => {
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
    <div className='flex flex-col md:flex-row bg-[#F5F5F5] min-h-screen'>
      {/* Left Section */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center bg-primary py-10 px-6 md:px-12'>
        <img src='/undraw_contemplating_re_ynec.svg' className='h-64 md:h-auto object-contain' alt='Login Background' />
        <h1 className='text-2xl md:text-4xl text-black font-bold text-center mt-6'>
          Let's Tic Tac Toe
        </h1>
        <p className='text-lg md:text-xl text-black font-semibold text-center mt-2'>
          Tickle your toes with tic-tac-toe
        </p>
      </div>

      {/* Right Section */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12'>
        <h1 className='text-xl md:text-3xl text-[#060606] font-semibold mb-4'>Tic Tac Toe !</h1>

        <div className='w-full max-w-md'>
          <div className='mb-6'>
            <h3 className='text-xl md:text-2xl font-semibold mb-2 text-black'>Login</h3>
            <p className='text-base md:text-lg mb-2 text-black'>Welcome Back! Please enter your details.</p>
          </div>

          <div className='w-full mb-4'>
            <input
              type='text'
              placeholder='Username'
              onChange={(e) => {
                setUsername(e.target.value);
              }} 
              className='w-full text-black py-2 px-3 bg-transparent border-b border-black placeholder-gray-500 focus:outline-none'
            />
          </div>

          <div className='w-full mb-4'>
            <input
              type='password'
              placeholder='Password'
              onChange={(e) => {
                setPassword(e.target.value);
              }} 
              className='w-full text-black py-2 px-3 bg-transparent border-b border-black placeholder-gray-500 focus:outline-none'
            />
          </div>

          <button className='w-full bg-purple-800 text-white rounded-md py-3 md:py-4 mb-4 md:mb-6 hover:bg-gray-900 flex items-center justify-center' onClick={login}>
            Log in
          </button>
        </div>
        
        <p className='text-sm text-black mt-6'>
          Dont have an account?
          <a href={"/signup"}>
            <span className='font-semibold underline cursor-pointer'>Sign up for free</span>
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login