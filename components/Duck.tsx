
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

const IDLE_FRAMES = 17;
const LOOK_RIGHT_FRAMES = 6;

const FRAME_INTERVAL = 93;

const duckImages: Record<
  Exclude<DuckState, "idle" | "look_right">,
  string
> = {
  happy: "/imagens_duck/happy/happy.png",
  sad: "/imagens_duck/sad/sad.png",
  surprise: "/imagens_duck/surprise/surprise.png",
  talking: "/imagens_duck/talking/talking.png",
  celebrating: "/imagens_duck/celebrating/celebrating.png",

  look_left: "/imagens_duck/looking/look_left.png",
  look_center: "/imagens_duck/looking/look_center.png",
};

export default function Duck({
  state,
  className = "",
}: DuckProps) {

  const [currentFrame, setCurrentFrame] = useState(1);

  // Pré-carrega as imagens do Duck
  useEffect(() => {

    // Frames idle
    for (let i = 1; i <= IDLE_FRAMES; i++) {
      const image = new Image();
      image.src = `/imagens_duck/idle/idle0${i}.png`;
    }

    // Frames look_right
    for (let i = 1; i <= LOOK_RIGHT_FRAMES; i++) {
      const image = new Image();
      image.src = `/imagens_duck/looking/look_right0${i}.png`;
    }

    // Imagens únicas
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
    ? `/imagens_duck/idle/idle0${currentFrame}.png`
    : state === "look_right"
    ? `/imagens_duck/looking/look_right0${currentFrame}.png`
    : duckImages[state];

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
