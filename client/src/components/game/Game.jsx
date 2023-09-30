import React, {useState} from 'react';
import Board from './Board';
import {Window, MessageList, MessageInput} from 'stream-chat-react';
import "./Chat.css";

function Game({channel, setChannel}) {
  const [playersJoined, setPlayersJoined] = useState(
      channel.state.watcher_count === 2
    );

  const [result, setResult] = useState({winner: "none", state: "none"})

  channel.on("user.watching.start", (event) => {
    setPlayersJoined(event.watcher_count === 2)
  })
  if(!playersJoined){
    return <div>waiting for other players to join</div>
  }
  return (
    <div className='gameContainer'>
      <Board result={result} setResult={setResult}/>
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
      <button onClick={async () => {
        await channel.stopWatching();
        setChannel(null);
      }}>Leave Game</button>

      {result.state === "won" && <div>{result.winner} Won the game</div>}
      {result.state === "tie" && <div>Game tied</div>}

    </div>
  )
}

export default Game;