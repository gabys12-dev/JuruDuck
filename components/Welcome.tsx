
"use client";

import Duck from "./Duck";
import { useRef, useState } from "react";

type Letter = {
  id: number;
  letter: string;
  position: string;
};

const letters: Letter[] = [
  { id: 1, letter: "A", position: "left-[8%] top-[12%]" },
  { id: 2, letter: "B", position: "left-[18%] bottom-[12%]" },
  { id: 3, letter: "C", position: "right-[10%] top-[15%]" },
  { id: 4, letter: "D", position: "right-[18%] bottom-[10%]" },
  { id: 5, letter: "E", position: "left-[35%] top-[5%]" },
  { id: 6, letter: "F", position: "right-[35%] bottom-[5%]" },
];

export default function Welcome({ onStart }: { onStart: () => void }) {
  const containerRef = useRef<HTMLMainElement>(null);

  const dragRef = useRef<{
    id: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [positions, setPositions] = useState<
    Record<number, { x: number; y: number }>
  >({});

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

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0F172A] p-8"
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
      <div className="relative z-10 flex flex-col items-center">

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

        <p className="mt-6 max-w-lg text-center text-lg text-gray-300">
          Prepare-se para uma aventura divertida!
          <br />
          Aprenda, descubra e forme palavras brincando com as letras!
        </p>

        {/* Botão Começar */}
        <button
          type="button"
          onClick={onStart}
          className="mt-8 cursor-pointer rounded-xl bg-[#FF3B20] px-10 py-3 text-xl font-bold text-black transition duration-300 hover:scale-105 hover:bg-purple-400 active:scale-95"
        >
          Começar
        </button>

      </div>

    </main>
  );
}
