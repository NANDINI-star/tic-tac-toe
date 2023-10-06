import React, {useState} from 'react';
import {useChatContext, Channel} from 'stream-chat-react';
import axios from "axios";
import Game from './Game';
import CustomInput from './CustomInput';

function JoinGame({logout}) {
  var [rivalUsername, setRivalUsername] = useState("");
  const {client} = useChatContext();
  const [channel, setChannel] = useState(null);
  const [board, setBoard] = useState([]);


  const createChannel = async () => {
    console.log("CREATE CHANNEL")
    const response = 
      await axios.post("http://localhost:3001/auth/user", {rivalUsername}).then((res)=>{
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

  async function onSave(newData){
    const response = 
      await axios.post("http://localhost:3001/auth/user", {rivalUsername}).then((res)=>{
        return res.data.user
      })
    const params = new URLSearchParams();
    params.append("userId1", client.userID);
    params.append("userId2", response.userId);
    params.append("channelId", channel.data.id);
    params.append("gameId", channel.data.gameId);
    params.append("gameName", rivalUsername+client._user.name)
    params.append("gamePattern", newData.board)
    axios.post("http://localhost:3001/channel/save-channel-data", params).then((res)=> {
      setBoard(res.data.gamePattern.split(','));
    })
  }

  return (
    <div className="flex items-center justify-center h-screen space-bg">
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-gradient-to-r from-[#5714AC] via-[#F5F5F5] to-white animate-gradient-shift"></div>
      </div>
      <div className="relative z-10 text-center text-white">
        {channel ? (
          <Channel channel={channel} Input={CustomInput}>
            <Game channel={channel} setChannel={setChannel} onSave={onSave} board={board} logout={logout}/>
          </Channel>
        ) : (
          <div>
            <div className="mb-20 flex flex-col items-center space-y-4">
              <h4 className="mb-6 text-5xl font-semibold text-pink-500">
                Welcome, {client._user.name}!
              </h4>
              <h4 className="text-5xl font-extrabold tracking-tight text-pink-500 animate-moveUp">Launch a <span className="text-7xl text-purple-600">Game</span></h4>
            </div>        
            <input
              className="placeholder-gray-300 bg-purple-800 text-2xl border border-gray-300 rounded-lg w-[400px] h-[80px] px-6 py-3 mt-4 focus:outline-none focus:ring focus:border-blue-300 text-white"
              placeholder="Username of Rival..."
              onChange={(e) => setRivalUsername(e.target.value)}
            />
            <div className="mt-8">
              <button
                className="bg-purple-800 hover:bg-yellow-300 text-white  hover:text-black font-semibold px-6 py-3 rounded-full mr-4"
                onClick={createChannel}
              >
                Join Game Server
              </button>
            </div>
            <div>
              <button 
                className="bg-purple-800 hover:bg-yellow-300 text-white hover:text-black font-semibold px-6 py-3 mt-10 rounded-full"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JoinGame