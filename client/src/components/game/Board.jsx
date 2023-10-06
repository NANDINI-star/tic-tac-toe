import React, {useEffect, useState} from 'react';
import {useChannelStateContext, useChatContext} from 'stream-chat-react';
import Square from './Square';
import {Patterns} from "./WinningPatterns";

function Board({result, setResult, onSave, initialBoard}) {
  console.log(initialBoard)
  const [board, setBoard] = useState(
    (initialBoard.length > 0) && (initialBoard != undefined) ? initialBoard :
    ["","","","","","","","",""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  const {channel} = useChannelStateContext();
  const {client} = useChatContext();
  const [playerScore, setPlayerScore] = useState(0);
  const [rivalScore, setRivalScore] = useState(0);
  const [tieScore, setTieScore] = useState(0);
  const [squareChosen, setSquareChosen] = useState(0);

  useEffect(() => {
    checkIfTie();
    checkWin();
  }, [squareChosen])

  const chooseSquare = async (square) => {
    setSquareChosen(squareChosen+1)
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
    console.log("CHECK WIN!!!")
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
  const checkIfTie = () => {
    console.log("CHECK TIE")
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
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(event.data.reset)
    }
    else if(event.type === "set-score" && event.user.id !== client.userID){
      
    }
  })

  function handleSave() {
    let postData = {board:board};
    onSave(postData);
  }

  async function handleReset() {
    if( turn === player){
      setBoard(["","","","","","","","",""])
      await channel.sendEvent({
        type: "reset-game",
        data: {reset: ["","","","","","","","",""], player},
      })
    }
  }

  return (
    <div className='bg-black rounded-[30px]'>
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
      </div>
      <div className="text-center flex flex-col gap-2 justify-center item-center">
        <button className="bg-purple-800 hover:bg-yellow-300 text-white hover:text-black font-semibold px-4 py-2 rounded-lg m-2" onClick={handleSave}>Save</button>
        <button className="bg-purple-800 hover:bg-yellow-300 text-white hover:text-black font-semibold px-4 py-2 rounded-lg m-2" onClick={handleReset}>Reset</button>
        <p className="text-lg">You are player {player}</p>
        <p>Whose turn? {turn}</p>
        <p className="text-xl font-semibold">High Score</p>
        <div className='flex gap-20 justify-center'>
          <h1 className='text-4xl'>{playerScore}</h1>
          <h1 className='text-4xl'>{tieScore}</h1>
          <h1 className='text-4xl'>{rivalScore}</h1>
        </div>
        <div className="flex gap-10 justify-center align-center ml-12 pb-10">
          
          <h1 className="text-2xl text-blue-500">
          Player {player}
            
          </h1>
          <h1 className="text-2xl text-green-500">
           Ties
          </h1>
          <h1 className="text-2xl text-red-500">
            Rival Player {player === "X" ? "O" : "X"}
            
          </h1>
        </div>
      </div>
    </div>

  )
}

export default Board