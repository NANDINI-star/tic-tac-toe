import React, {useEffect, useState} from 'react';
import {useChannelStateContext, useChatContext} from 'stream-chat-react';
import Square from './Square';
import {Patterns} from "./WinningPatterns";

function Board({result, setResult, onSave, initialBoard}) {
  console.log(initialBoard, "BOARD")
  const [board, setBoard] = useState(
    (initialBoard != []) && (initialBoard != undefined) ? initialBoard :
    ["","","","","","","","",""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  const {channel} = useChannelStateContext();
  const {client} = useChatContext();
  const [playerScore, setPlayerScore] = useState(0);
  const [rivalScore, setRivalScore] = useState(0);
  const [tieScore, setTieScore] = useState(0);


  useEffect(() => {
    checkIfTie();
    checkWin();
  }, [board])

  const chooseSquare = async (square) => {
    if( turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X");
      await channel.sendEvent({
        type: "game-move",
        data: {square, player},
      })
      setBoard(board.map((val, idx) => {
        if(idx === square && val === "") {
          return player;
        }
        return val;
      }))
    }
  }

  const checkWin = () => {
    Patterns.forEach(async(currPattern) => {
      const firstPlayer = board[currPattern[0]];
      if(firstPlayer === "") return;
      let foundWinningPattern = true;
      currPattern.forEach((idx) => {
        if(board[idx] !== firstPlayer) {
          foundWinningPattern = false;
        }
      })

      if(foundWinningPattern) {
        alert("winner", board[currPattern[0]])
        setResult({winner: board[currPattern[0]], state: "won"})
        handleReset();
        console.log(board[currPattern[0]], turn)
        if(board[currPattern[0]] === player){
          setPlayerScore(playerScore+1);
          await channel.sendEvent({
            type: "set-score",
            data: {rivalScore: playerScore, player},
          })
        }
        
      }
      
    })
  }
  console.log("PLAYER SCORE", playerScore)
  const checkIfTie = () => {
    let filled = true;
    board.forEach((square) => {
      if(square === ""){
        filled = false
      }
    });

    if(filled) {
      alert("game tied");

      setResult({winner: "none", state: "tie"});
      handleReset();
    }
  }

  channel.on((event) => {
    console.log("channel on", event.user.id,client.userID)
    if(event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(board.map((val, idx) => {
        if(idx === event.data.square && val === "") {
          return event.data.player;
        }
        return val;
      }))
    }
    else if(event.type === "reset-game" && event.user.id !== client.userID) {
      console.log("HERE")
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(event.data.reset)
    }
    else if(event.type === "set-score" && event.user.id !== client.userID){
      
    }
  })

  function handleSave() {
    console.log("handleSave")
    let postData = {board:board};
    console.log("handleSave", postData)
    onSave(postData);
  }

  async function handleReset() {
    console.log("1")
    if( turn === player){
      console.log("1")
      setBoard(["","","","","","","","",""])
      await channel.sendEvent({
        type: "reset-game",
        data: {reset: ["","","","","","","","",""], player},
      })
    }
  }

  return (
    <div className='board'>
      <div className="row">
        <Square
          val={board[0]}
          chooseSquare={() => {
            chooseSquare(0);
          }}
        />
        <Square
          val={board[1]}
          chooseSquare={() => {
            chooseSquare(1);
          }}
        />
        <Square
          val={board[2]}
          chooseSquare={() => {
            chooseSquare(2);
          }}
        />
      </div>
      <div className="row">
        <Square
          val={board[3]}
          chooseSquare={() => {
            chooseSquare(3);
          }}
        />
        <Square
          val={board[4]}
          chooseSquare={() => {
            chooseSquare(4);
          }}
        />
        <Square
          val={board[5]}
          chooseSquare={() => {
            chooseSquare(5);
          }}
        />
      </div>
      <div className="row">
        <Square
          val={board[6]}
          chooseSquare={() => {
            chooseSquare(6);
          }}
        />
        <Square
          val={board[7]}
          chooseSquare={() => {
            chooseSquare(7);
          }}
        />
        <Square
          val={board[8]}
          chooseSquare={() => {
            chooseSquare(8);
          }}
        />
      </div>
      <button onClick={handleSave}>save button</button>
      <button onClick={handleReset}>reset</button>
      <p>you are player {player}</p>
      <p>who's turn? =  {turn}</p>
      <div>
        <p>High Score</p>
        <p>
          <span>Player {player}</span>
          <span>{playerScore}</span>
        </p>
        <p>
          <span>Ties </span>
          <span>{tieScore}</span>
        </p>
        <p>
          <span>Rival Player {player === "X" ? "O" : "X"} </span>
          <span>{rivalScore}</span>
        </p>
      </div>
    </div>
  )
}

export default Board