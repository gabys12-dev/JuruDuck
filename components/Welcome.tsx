
"use client";

import Duck from "./Duck";
import { supabase } from "../lib/supabase";
import { useEffect, useRef, useState } from "react";

type Letter = {
  id: number;
  letter: string;
  position: string;
};

type DifficultyName = "Fácil" | "Médio" | "Difícil";

type RankingRow = {
  player_name: string;
  difficulty: string;
  score: number;
};

const letters: Letter[] = [
  { id: 1, letter: "A", position: "left-[8%] top-[12%]" },
  { id: 2, letter: "B", position: "left-[18%] bottom-[12%]" },
  { id: 3, letter: "C", position: "right-[10%] top-[15%]" },
  { id: 4, letter: "D", position: "right-[18%] bottom-[10%]" },
  { id: 5, letter: "E", position: "left-[35%] top-[5%]" },
  { id: 6, letter: "F", position: "right-[35%] bottom-[5%]" },
];

const difficulties: DifficultyName[] = [
  "Fácil",
  "Médio",
  "Difícil",
];

export default function Welcome({
  onStart,
}: {
  onStart: (name: string) => void;
}) {
  const containerRef = useRef<HTMLElement>(null);

  const dragRef = useRef<{
    id: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [positions, setPositions] = useState<
    Record<number, { x: number; y: number }>
  >({});

  const [playerName, setPlayerName] = useState("");

  const [ranking, setRanking] = useState<
    Record<DifficultyName, RankingRow[]>
  >({
    "Fácil": [],
    "Médio": [],
    "Difícil": [],
  });

  const [loadingRanking, setLoadingRanking] = useState(true);
  const [rankingError, setRankingError] = useState("");

  // Busca o Top 3 de cada dificuldade no Supabase
  useEffect(() => {
    async function loadRanking() {
      setLoadingRanking(true);
      setRankingError("");

      const results = await Promise.all(
        difficulties.map(async (difficulty) => {
          const { data, error } = await supabase
            .from("ranking")
            .select("player_name, difficulty, score")
            .eq("difficulty", difficulty)
            .order("score", { ascending: false })
            .limit(3);

          if (error) {
            throw error;
          }

          return {
            difficulty,
            players: (data ?? []) as RankingRow[],
          };
        })
      );

      const newRanking: Record<
        DifficultyName,
        RankingRow[]
      > = {
        "Fácil": [],
        "Médio": [],
        "Difícil": [],
      };

      results.forEach((result) => {
        newRanking[result.difficulty] = result.players;
      });

      setRanking(newRanking);
    }

    loadRanking()
      .catch((error) => {
        console.error("Erro ao carregar ranking:", error);
        setRankingError(
          "Não foi possível carregar o ranking."
        );
      })
      .finally(() => {
        setLoadingRanking(false);
      });
  }, []);

  function handleStart() {
    const name = playerName.trim();

    if (!name) return;

    onStart(name);
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
    id: number
  ) {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const letterRect = event.currentTarget.getBoundingClientRect();

    const x = letterRect.left - containerRect.left;
    const y = letterRect.top - containerRect.top;

    setPositions((prev) => ({
      ...prev,
      [id]: { x, y },
    }));

    dragRef.current = {
      id,
      offsetX: event.clientX - letterRect.left,
      offsetY: event.clientY - letterRect.top,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    const container = containerRef.current;
    const drag = dragRef.current;

    if (!container || !drag) return;

    const containerRect = container.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(
        event.clientX - containerRect.left - drag.offsetX,
        containerRect.width - 90
      )
    );

    const y = Math.max(
      0,
      Math.min(
        event.clientY - containerRect.top - drag.offsetY,
        containerRect.height - 90
      )
    );

    setPositions((prev) => ({
      ...prev,
      [drag.id]: { x, y },
    }));
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center overflow-hidden bg-[#0F172A] p-6 md:p-8"
    >
      {/* Letras flutuantes e arrastáveis */}
      <div className="absolute inset-0 pointer-events-none">
        {letters.map((item) => {
          const position = positions[item.id];

          return (
            <div
              key={item.id}
              onPointerDown={(event) =>
                handlePointerDown(event, item.id)
              }
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`absolute pointer-events-auto touch-none select-none cursor-grab active:cursor-grabbing ${
                position ? "" : item.position
              }`}
              style={
                position
                  ? {
                      left: position.x,
                      top: position.y,
                    }
                  : undefined
              }
            >
              <div className="floating-card flex h-[90px] w-[90px] items-center justify-center rounded-[28px] bg-[#D9D9D9] text-[55px] font-medium text-black shadow-lg transition-shadow hover:shadow-xl">
                {item.letter}
              </div>
            </div>
          );
        })}
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">

        <h1 className="text-4xl md:text-6xl font-bold text-[#FF3B20] text-center">
          Seja Bem-vindo
          <br />
          ao
          <br />
          JuruDuck!
        </h1>

        {/* Personagem */}
        <Duck
          state="idle"
          className="w-48 h-48"
        />

        <p className="mt-2 max-w-lg text-center text-lg text-gray-300">
          Prepare-se para uma aventura divertida!
          <br />
          Aprenda, descubra e forme palavras brincando com as letras!
        </p>

        {/* Identificação do jogador */}
        <div className="mt-7 w-full max-w-md rounded-2xl border border-white/10 bg-[#1E293B] p-5 shadow-xl">
          <label
            htmlFor="playerName"
            className="mb-3 block text-center text-lg font-bold text-white"
          >
            Como devemos chamar você?
          </label>

          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(event) =>
              setPlayerName(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") handleStart();
            }}
            maxLength={20}
            placeholder="Digite seu nome..."
            className="w-full rounded-xl border border-gray-600 bg-[#0F172A] px-4 py-3 text-center text-white outline-none transition focus:border-[#FF3B20]"
          />

          <button
            type="button"
            onClick={handleStart}
            disabled={!playerName.trim()}
            className="mt-4 w-full cursor-pointer rounded-xl bg-[#FF3B20] px-8 py-3 text-lg font-bold text-black transition duration-300 hover:scale-[1.02] hover:bg-purple-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Começar
          </button>
        </div>

        {/* Ranking */}
        <section className="mt-10 w-full">
          <h2 className="mb-6 text-center text-3xl font-bold text-[#FF3B20]">
            🏆 Ranking JuruDuck
          </h2>

          {loadingRanking && (
            <p className="text-center text-gray-300">
              Carregando ranking...
            </p>
          )}

          {rankingError && (
            <p className="text-center text-red-400">
              {rankingError}
            </p>
          )}

          {!loadingRanking && !rankingError && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {difficulties.map((difficulty) => (
                <div
                  key={difficulty}
                  className="rounded-2xl border border-white/10 bg-[#1E293B] p-5 shadow-lg"
                >
                  <h3 className="mb-4 text-center text-xl font-bold text-white">
                    {difficulty}
                  </h3>

                  {ranking[difficulty].length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">
                      Ainda não há pontuações.
                      <br />
                      Seja o primeiro!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {ranking[difficulty].map(
                        (player, index) => (
                          <div
                            key={`${player.player_name}-${index}`}
                            className="flex items-center justify-between rounded-lg bg-[#0F172A] p-3"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">
                                {["🥇", "🥈", "🥉"][index]}
                              </span>

                              <span className="max-w-[125px] truncate text-sm font-medium text-white">
                                {player.player_name}
                              </span>
                            </div>

                            <span className="font-bold text-[#FF3B20]">
                              {player.score} pts
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
