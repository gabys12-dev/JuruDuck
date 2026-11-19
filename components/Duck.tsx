
"use client";

import { useState, useEffect } from "react";

type DuckState =
  | "idle"
  | "happy"
  | "sad"
  | "surprise"
  | "talking"
  | "celebrating"
  | "look_left"
  | "look_center"
  | "look_right";

type DuckProps = {
  state: DuckState;
  className?: string;
};

// Configurações das animações
const IDLE_FRAMES = 17;
const LOOK_RIGHT_FRAMES = 6;
const FRAME_INTERVAL = 93;

// Caminho base do projeto
const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/JuruDuck" : "";

// Função para montar os caminhos das imagens
const getDuckImagePath = (path: string): string => {
  return `${BASE_PATH}${path}`;
};

// Imagens das expressões do Duck
const duckImages: Record<
  Exclude<DuckState, "idle" | "look_right">,
  string
> = {
  happy: getDuckImagePath("/imagens_duck/happy/happy.png"),
  sad: getDuckImagePath("/imagens_duck/sad/sad.png"),
  surprise: getDuckImagePath("/imagens_duck/surprise/surprise.png"),
  talking: getDuckImagePath("/imagens_duck/talking/talking.png"),
  celebrating: getDuckImagePath("/imagens_duck/celebrating/celebrating.png"),

  look_left: getDuckImagePath("/imagens_duck/looking/look_left.png"),
  look_center: getDuckImagePath("/imagens_duck/looking/look_center.png"),
};

export default function Duck({
  state,
  className = "",
}: DuckProps) {
  const [currentFrame, setCurrentFrame] = useState(1);

  // Pré-carrega as imagens do Duck
  useEffect(() => {
    // Frames da animação idle
    for (let i = 1; i <= IDLE_FRAMES; i++) {
      const image = new Image();

      image.src = getDuckImagePath(
        `/imagens_duck/idle/idle0${i}.png`
      );
    }

    // Frames da animação look_right
    for (let i = 1; i <= LOOK_RIGHT_FRAMES; i++) {
      const image = new Image();

      image.src = getDuckImagePath(
        `/imagens_duck/looking/look_right0${i}.png`
      );
    }

    // Pré-carrega as imagens das expressões
    Object.values(duckImages).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  // Reinicia o contador quando muda o estado
  useEffect(() => {
    setCurrentFrame(1);
  }, [state]);

  // Animação automática
  useEffect(() => {
    if (state !== "idle" && state !== "look_right") {
      return;
    }

    const totalFrames =
      state === "idle" ? IDLE_FRAMES : LOOK_RIGHT_FRAMES;

    const interval = window.setInterval(() => {
      setCurrentFrame((previous) => {
        return previous >= totalFrames ? 1 : previous + 1;
      });
    }, FRAME_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [state]);

  // Caminho da imagem atual
  const imageSrc =
    state === "idle"
      ? getDuckImagePath(
          `/imagens_duck/idle/idle0${currentFrame}.png`
        )
      : state === "look_right"
      ? getDuckImagePath(
          `/imagens_duck/looking/look_right0${currentFrame}.png`
        )
      : duckImages[state];

  return (
    <div className="relative z-50 flex flex-col items-center">
      <img
        src={imageSrc}
        alt={`JuruDuck - ${state}`}
        className={`object-contain ${className}`}
        draggable={false}
        onError={() => {
          console.error(
            "Imagem não encontrada:",
            imageSrc
          );
        }}
      />
    </div>
  );
}
