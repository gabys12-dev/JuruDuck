
"use client";

import { useState } from "react";

import Welcome from "../components/Welcome";
import Difficulty from "../components/Difficulty";
import Game from "../components/Game";

type DifficultyName = "Fácil" | "Médio" | "Difícil";

type Screen = "welcome" | "difficulty" | "game";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyName>("Fácil");

  const [playerName, setPlayerName] = useState("");

  return (
    <>
      {/* Tela inicial */}
      {screen === "welcome" && (
        <Welcome
          onStart={(name) => {
            const cleanName = name.trim();

            setPlayerName(cleanName);

            sessionStorage.setItem(
              "juruduck_player_name",
              cleanName
            );

            setScreen("difficulty");
          }}
        />
      )}

      {/* Escolha da dificuldade */}
      {screen === "difficulty" && (
        <Difficulty
          onBack={() => setScreen("welcome")}
          onContinue={(level) => {
            setSelectedDifficulty(level);
            setScreen("game");
          }}
        />
      )}

      {/* Jogo */}
      {screen === "game" && (
        <Game
          difficulty={selectedDifficulty}
          playerName={playerName}
          onBack={() => setScreen("difficulty")}
        />
      )}
    </>
  );
}
