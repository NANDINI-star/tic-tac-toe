import React, {useState} from 'react';
import Board from './Board';
import {Window, MessageList, MessageInput} from 'stream-chat-react';
import "./Chat.css";

function Game({channel, setChannel, onSave, board, logout}) {
  const [playersJoined, setPlayersJoined] = useState(
      channel.state.watcher_count === 2
    );

  const [result, setResult] = useState({winner: "none", state: "none"})

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2)
  })
  if(!playersJoined){
    return (
    <div>
      <p className='text-black'>waiting for other players to join...</p>
      <button className='hover:bg-yellow-300 text-black hover:text-black font-semibold px-6 py-3 rounded-full' onClick={logout}>Logout</button>
    </div>
    );
  }
  return (
    <div>
      <div className='gameContainer'>
        <h1></h1>
        <Board result={result} setResult={setResult} onSave={onSave} initialBoard={board}/>
        <div className='flex flex-col gap-20'>
          {/* CHAT */}
          <Window>
            <MessageList 
              disableDateSeparator 
              closeReactionSelectorOnClick 
              hideDeletedMessages
              messageActions={["react"]}
            />
            <MessageInput noFiles/>
          </Window>

          {/* LEAVE GAME BUTTON */}
          <div className='flex gap-20'>
            <button className='bg-purple-800 hover:bg-yellow-300 text-white hover:text-black font-semibold px-6 py-3 rounded-full top-0 right-0 ' onClick={async () => {
              await channel.stopWatching();
              setChannel(null);
            }}>Leave Game</button>

            <button className='bg-purple-800 hover:bg-yellow-300 text-white hover:text-black font-semibold px-6 py-3 rounded-full top-0 right-0 ' onClick={logout}>Logout</button>
          </div>
          
        </div>
      </div>
      <div>
        {result.state === "won" && <div><h4 className='text-purple' style={{color: "black", fontWeight: "10",fontSize: "100px", marginTop: "30px"}}>{result.winner} Won the game</h4></div>}
        {result.state === "tie" && <div><h4 className='text-purple' style={{color: "black", fontWeight: "10", fontSize: "100px", marginTop: "30px"}}>Game tied</h4></div>}
      </div>  
    </div>
  )
}

export default Game;