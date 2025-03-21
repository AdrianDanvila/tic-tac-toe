"use client";
import { useState, useEffect } from "react";

const socket = new WebSocket("ws://localhost:8080");
const gameId = "partida-1"; // Puedes hacer esto dinámico en el futuro

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [player, setPlayer] = useState<string | null>(null);

  useEffect(() => {
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join", gameId }));
      setPlayer("X"); // En el futuro, puedes hacer que el servidor asigne X u O
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "update") {
        setBoard(data.board);
        setTurn(data.turn);
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
      <div className="grid grid-cols-3 gap-2">
        {board.map((value, index) => (
          <button
            key={index}
            className="w-16 h-16 text-2xl font-bold flex items-center justify-center border border-gray-500"
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        ))}
      </div>
      <p className="mt-4 text-lg">{`Turno de: ${turn}`}</p>
    </div>
  );
}
