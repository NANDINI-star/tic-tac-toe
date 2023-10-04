import React, {useState} from 'react';
import {useChatContext, Channel} from 'stream-chat-react';
import axios from "axios";
import Game from './Game';
import CustomInput from './CustomInput';
import { useEffect } from 'react';

function JoinGame() {
  console.log("JOINGAME")
  var [rivalUsername, setRivalUsername] = useState("");
  const {client} = useChatContext();
  const [channel, setChannel] = useState(null);
  const [board, setBoard] = useState([]);

  // useEffect(() => {
  //   console.log("^^^^^^^^^USEFF")
  //   
  // },[])

  const createChannel = async () => {
    try{

      const params = new URLSearchParams();
      params.append("userId1", client.userID);
      params.append("gameName", "king2king");
      axios.get(`http://localhost:3001/channel/channel-data?${params}`).then((res)=>{
        setBoard(res.data.gamePattern.split(','))
      }).catch((error)=>{alert("No game to resume")})

      const response = 
      await axios.post("http://localhost:3001/auth/user", {rivalUsername}).then((res)=>{
        return res.data.user
      })
      if(!response){
        alert("User not found")
        return
      }
      console.log(response.userId)
      const newChannel = await client.channel("messaging", {
        members: [client.userID, response.userId],
      });
      
      await newChannel.watch()
      setChannel(newChannel)
    } catch(error) {
      alert(error)
    }
    
  }

  async function onSave(newBoard){
    console.log(rivalUsername)
    const response = 
      await axios.post("http://localhost:3001/auth/user", {rivalUsername}).then((res)=>{
        return res.data.user
      })
    console.log("onSave")
    const params = new URLSearchParams();
    params.append("userId1", client.userID);
    params.append("userId2", response.userId);
    params.append("channelId", channel.data.id);
    // console.log(channel);
    params.append("gameName", rivalUsername+client._user.name)
    params.append("gamePattern", newBoard.board)
    // console.log(params);
    axios.post("http://localhost:3001/channel/save-channel-data", params).then((res)=> {
      setBoard(res.data.gamePattern.split(','));
    })
  }

  return (
    <>
      { channel ?
        <Channel channel={channel} Input={CustomInput}>
          <Game channel={channel} setChannel={setChannel} onSave={onSave} board={board}/>
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
        <div>
          <button onClick={createChannel}>Resume Game</button>
        </div>
      </>
      }
    </>
    
    
    
  )
}

export default JoinGame