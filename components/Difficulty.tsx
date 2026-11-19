
"use client";

import { useState } from "react";
import Duck from "./Duck";

type DifficultyName = "Fácil" | "Médio" | "Difícil";

type DifficultyProps = {
  onBack: () => void;
  onContinue: (difficulty: DifficultyName) => void;
};

type DifficultyLevel = {
  name: DifficultyName;
  description: string;
  color: string;
  icon: string;
  duckState: "look_left" | "look_center" | "look_right";
};

export default function Difficulty({
  onBack,
  onContinue,
}: DifficultyProps) {

  const difficulties: DifficultyLevel[] = [
    {
      name: "Fácil",
      description: "Comece sua aventura com palavras simples!",
      color: "#4ADE80",
      icon: "🌱",
      duckState: "look_left",
    },
    {
      name: "Médio",
      description: "Desafie seus conhecimentos com novas palavras!",
      color: "#FACC15",
      icon: "⭐",
      duckState: "look_center",
    },
    {
      name: "Difícil",
      description: "Mostre que você domina as palavras!",
      color: "#FB7185",
      icon: "🔥",
      duckState: "look_right",
    },
  ];

  const [selected, setSelected] =
    useState<DifficultyName>("Fácil");

  const selectedDifficulty = difficulties.find(
    (difficulty) => difficulty.name === selected
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] p-8">

      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#FF3B20] text-center">
        Escolha sua dificuldade
      </h1>

      <p className="mt-4 text-lg text-gray-300 text-center">
        Qual será o seu desafio de hoje?
      </p>

      {/* Personagem */}
      <div className="mt-4">
        {selectedDifficulty && (
          <Duck
            key={selectedDifficulty.duckState}
            state={selectedDifficulty.duckState}
            className="w-48 h-48"
          />
        )}
      </div>

      {/* Opções de dificuldade */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">

        {difficulties.map((difficulty) => (

          <button
            key={difficulty.name}
            type="button"
            onClick={() => setSelected(difficulty.name)}
            aria-pressed={selected === difficulty.name}
            className={`flex flex-col items-center justify-center gap-4 rounded-3xl p-8 border-2 transition duration-300 hover:scale-105 ${
              selected === difficulty.name
                ? "border-[#FF3B20] bg-[#1E293B] scale-105"
                : "border-gray-700 bg-[#172033]"
            }`}
          >

            <span className="text-6xl">
              {difficulty.icon}
            </span>

            <h2
              className="text-2xl font-bold"
              style={{ color: difficulty.color }}
            >
              {difficulty.name}
            </h2>

            <p className="text-sm text-gray-300 text-center">
              {difficulty.description}
            </p>

            {selected === difficulty.name && (
              <span className="text-[#FF3B20] font-bold">
                ✓ Selecionado
              </span>
            )}

          </button>

        ))}

      </div>

      {/* Botões de navegação */}
      <div className="mt-10 flex gap-4">

        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-gray-500 px-8 py-3 text-lg font-bold text-white hover:bg-gray-700 transition"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={() => onContinue(selected)}
          className="rounded-xl bg-[#FF3B20] px-8 py-3 text-lg font-bold text-black hover:bg-[#ff604d] transition"
        >
          Continuar
        </button>

      </div>

    </main>
  );
}
