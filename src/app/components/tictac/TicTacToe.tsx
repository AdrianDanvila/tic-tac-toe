"use client";
import { useState, useEffect } from "react";

const socket = new WebSocket("wss://tic-tac-toe-be-g6ec.onrender.com");
const gameId = "partida-1";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [player, setPlayer] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join", gameId }));
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "assign") {
        setPlayer(data.player);
        setBoard(data.board);
        setTurn(data.turn);
      }

      if (data.type === "update") {
        setBoard(data.board);
        setTurn(data.turn);
      }

      if (data.type === "full") {
        setMessage("La sala está llena, espera a que termine la partida.");
      }
    };
  }, []);

  const handleClick = (index: number) => {
    if (board[index] || turn !== player) return;
    socket.send(JSON.stringify({ type: "move", gameId, index, player }));
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">3 en Raya - Multijugador</h1>
      {message && <p className="text-red-500">{message}</p>}
      <p className="mb-2 text-lg">Eres: {player || "Esperando..."}</p>
      <p className="mb-4 text-lg">Turno de: {turn}</p>
      <div className="grid grid-cols-3 gap-2">
        {board.map((value, index) => (
          <button
            key={index}
            className="w-16 h-16 text-2xl font-bold flex items-center justify-center border border-gray-500"
            onClick={() => handleClick(index)}
            disabled={!!value}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
