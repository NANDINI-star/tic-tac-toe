import React, {useState} from 'react';
import {useChatContext, Channel} from 'stream-chat-react';
import axios from "axios";
import Game from './Game';
import CustomInput from './CustomInput';

function JoinGame() {
  const [rivalUsername, setRivalUsername] = useState("");
  const {client} = useChatContext();
  const [channel, setChannel] = useState(null);
  const createChannel = async () => {
    const response = 
      await axios.post("http://localhost:3001/user", {rivalUsername}).then((res)=>{
        return res.data.user
      })
  
    if(!response){
      alert("User not found")
      return
    }

    const newChannel = await client.channel("messaging", {
      members: [client.userID, response.userId],
    });
    
    await newChannel.watch()
    setChannel(newChannel)
  }
  return (
    <>
      { channel ?
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel}/>
        </Channel>
        
       :
        <>
        <div className='joinGame'>
          <h4>
            Create Game
          </h4>
          <input 
            placeholder='Username of rival...' 
            onChange={(e) => {setRivalUsername(e.target.value)}}/>
        </div>
        <div>
          <button onClick={createChannel}>Join/ Start Game</button>
        </div>
      </>
      }
    </>
    
    
    
  )
}

export default JoinGame