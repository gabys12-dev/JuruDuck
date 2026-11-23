
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

// Quantidade de frames de cada animação
const ANIMATION_FRAMES = {
  idle: 17,
  look_right: 6,
  celebrating: 6,
  sad: 17,
};

const FRAME_INTERVAL = 93;

// Caminho base do projeto
const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/JuruDuck" : "";

// Monta os caminhos das imagens
const getDuckImagePath = (path: string): string => {
  return `${BASE_PATH}${path}`;
};

// Monta o caminho de cada frame
const getFramePath = (
  animation: string,
  frame: number
): string => {
  const frameNumber = String(frame).padStart(2, "0");

  return getDuckImagePath(
    `/imagens_duck/${animation}/${animation}${frameNumber}.png`
  );
};

// Imagens estáticas das expressões
const duckImages: Record<
  Exclude<
    DuckState,
    "idle" | "look_right" | "celebrating" | "sad"
  >,
  string
> = {
  happy: getDuckImagePath("/imagens_duck/happy/happy.png"),
  surprise: getDuckImagePath("/imagens_duck/surprise/surprise.png"),
  talking: getDuckImagePath("/imagens_duck/talking/talking.png"),
  look_left: getDuckImagePath("/imagens_duck/looking/look_left.png"),
  look_center: getDuckImagePath("/imagens_duck/looking/look_center.png"),
};

export default function Duck({
  state,
  className = "",
}: DuckProps) {
  const [currentFrame, setCurrentFrame] = useState(1);

  // Pré-carrega todas as imagens
  useEffect(() => {
    const animations = [
      { name: "idle", totalFrames: ANIMATION_FRAMES.idle },
      {
        name: "look_right",
        totalFrames: ANIMATION_FRAMES.look_right,
      },
      {
        name: "celebrating",
        totalFrames: ANIMATION_FRAMES.celebrating,
      },
      {
        name: "sad",
        totalFrames: ANIMATION_FRAMES.sad,
      },
    ];

    animations.forEach(({ name, totalFrames }) => {
      for (let i = 1; i <= totalFrames; i++) {
        const image = new Image();
        image.src = getFramePath(name, i);
      }
    });

    // Pré-carrega as imagens estáticas
    Object.values(duckImages).forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  // Reinicia a animação quando o estado muda
  useEffect(() => {
    setCurrentFrame(1);
  }, [state]);

  // Controla as animações
  useEffect(() => {
    const isAnimated = state in ANIMATION_FRAMES;

    if (!isAnimated) {
      return;
    }

    const totalFrames =
      ANIMATION_FRAMES[state as keyof typeof ANIMATION_FRAMES];

    const interval = window.setInterval(() => {
      setCurrentFrame((previous) => {
        return previous >= totalFrames ? 1 : previous + 1;
      });
    }, FRAME_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [state]);

  // Define a imagem atual
  const imageSrc = (() => {
    switch (state) {
      case "idle":
      case "look_right":
      case "celebrating":
      case "sad":
        return getFramePath(state, currentFrame);

      default:
        return duckImages[state];
    }
  })();

  return (
    <div className="relative z-50 flex flex-col items-center">
      <img
        src={imageSrc}
        alt={`JuruDuck - ${state}`}
        className={`object-contain ${className}`}
        draggable={false}
        onError={() => {
          console.error("Imagem não encontrada:", imageSrc);
        }}
      />
    </div>
  );
}
