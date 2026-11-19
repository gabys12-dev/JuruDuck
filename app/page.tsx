
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

  return (
    <>
      {screen === "welcome" && (
        <Welcome onStart={() => setScreen("difficulty")} />
      )}

      {screen === "difficulty" && (
        <Difficulty
          onBack={() => setScreen("welcome")}
          onContinue={(level) => {
            setSelectedDifficulty(level as DifficultyName);
            setScreen("game");
          }}
        />
      )}

      {screen === "game" && (
        <Game
          difficulty={selectedDifficulty}
          onBack={() => setScreen("difficulty")}
        />
      )}
    </>
  );
}
