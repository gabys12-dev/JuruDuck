
"use client";

import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import Duck from "./Duck";

type DifficultyName = "Fácil" | "Médio" | "Difícil";

type WordChallenge = {
  word: string;
  hint: string;
};

type LetterTile = {
  id: number;
  letter: string;
};

type GameProps = {
  difficulty: DifficultyName;
  onBack: () => void;
};


const WORDS: Record<DifficultyName, WordChallenge[]> = {
  "Fácil": [
    {
      word: "LIXA",
      hint: "Utilizada para lixar e preparar superfícies."
    },
    {
      word: "PIA",
      hint: "Pode ser instalada na cozinha ou no banheiro."
    },
    {
      word: "PISO",
      hint: "Revestimento utilizado no chão dos ambientes."
    },
    {
      word: "TINTA",
      hint: "Utilizada para dar cor e acabamento às paredes."
    },
    {
      word: "COLA",
      hint: "Produto utilizado para unir ou fixar materiais."
    },
  ],

  "Médio": [
    {
      word: "CIMENTO",
      hint: "Material muito utilizado na construção civil."
    },
    {
      word: "TORNEIRA",
      hint: "Controla a saída de água da pia."
    },
    {
      word: "CHUVEIRO",
      hint: "Equipamento utilizado para tomar banho."
    },
    {
      word: "REJUNTE",
      hint: "Utilizado para preencher os espaços entre pisos e revestimentos."
    },
    {
      word: "TELHA",
      hint: "Utilizada na cobertura de telhados."
    },
  ],

  "Difícil": [
    {
      word: "PORCELANATO",
      hint: "Revestimento utilizado em pisos e paredes, com diferentes acabamentos."
    },
    {
      word: "ARGAMASSA",
      hint: "Utilizada para assentar pisos, revestimentos e outros materiais."
    },
    {
      word: "IMPERMEABILIZANTE",
      hint: "Produto que ajuda a proteger superfícies contra infiltrações."
    },
    {
      word: "ELETRODUTO",
      hint: "Utilizado para proteger e conduzir fios e cabos elétricos."
    },
    {
      word: "ESMALTE",
      hint: "Tipo de tinta utilizado em diferentes superfícies, como madeira e metal."
    },
  ],
};

function shuffleLetters(word: string): LetterTile[] {
  const letters = [...word.toLocaleUpperCase("pt-BR")];

  return letters
    .map((letter, id) => ({ id, letter }))
    .sort(() => Math.random() - 0.5);
}

export default function Game({ difficulty, onBack }: GameProps) {
  const wordList = WORDS[difficulty];

  const [roundIndex, setRoundIndex] = useState(0);
  const [tiles, setTiles] = useState<LetterTile[]>(() =>
    shuffleLetters(WORDS["Fácil"][0].word)
  );
  const [slots, setSlots] = useState<(number | null)[]>(() =>
    Array(WORDS["Fácil"][0].word.length).fill(null)
  );
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);

  const [draggingTile, setDraggingTile] = useState<number | null>(null);

  const currentChallenge = wordList[roundIndex];

  useEffect(() => {
    const firstWord = WORDS[difficulty][0].word;

    setRoundIndex(0);
    setTiles(shuffleLetters(firstWord));
    setSlots(Array(firstWord.length).fill(null));
    setScore(0);
    setFeedback("");
    setSolved(false);
    setFinished(false);
  }, [difficulty]);

  // Verifica quais letras já foram utilizadas.
  const usedTiles = slots.filter(
    (tileId): tileId is number => tileId !== null
  );

  // Coloca uma letra no espaço escolhido.
  function placeTile(tileId: number, slotIndex: number) {
    if (solved || slots[slotIndex] !== null) return;
    if (usedTiles.includes(tileId)) return;

    setSlots((previous) => {
      const updated = [...previous];
      updated[slotIndex] = tileId;
      return updated;
    });

    setFeedback("");
  }

  // Retira uma letra do espaço quando o jogador clica nele.
  function removeTile(slotIndex: number) {
    if (solved) return;

    setSlots((previous) => {
      const updated = [...previous];
      updated[slotIndex] = null;
      return updated;
    });

    setFeedback("");
  }

  // Permite arrastar uma letra e soltá-la em um espaço.
  function handlePointerDown(
    event: React.PointerEvent<HTMLButtonElement>,
    tileId: number
  ) {
    if (solved || usedTiles.includes(tileId)) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingTile(tileId);
  }

  function handlePointerUp(
    event: React.PointerEvent<HTMLButtonElement>,
    tileId: number
  ) {
    const target = document.elementFromPoint(
      event.clientX,
      event.clientY
    );

    const slot = target?.closest("[data-slot-index]");

    if (slot) {
      const slotIndex = Number(
        slot.getAttribute("data-slot-index")
      );

      placeTile(tileId, slotIndex);
    }

    setDraggingTile(null);
  }

  // Confere se a palavra foi formada corretamente.
  function checkWord() {
    if (solved) return;

    if (slots.some((tileId) => tileId === null)) {
      setFeedback("Ainda faltam letras! Complete todos os espaços.");
      return;
    }

    const formedWord = slots
      .map((tileId) =>
        tiles.find((tile) => tile.id === tileId)?.letter ?? ""
      )
      .join("");

    const correctWord = currentChallenge.word.toLocaleUpperCase("pt-BR");

    if (formedWord === correctWord) {
      setScore((previous) => previous + 10);
      setFeedback("Muito bem! Você acertou! 🎉");
      setSolved(true);
    } else {
      setFeedback("Ops! A palavra não está correta. Tente novamente!");
    }
  }

  // Avança para o próximo desafio.
  function nextWord() {
    const nextIndex = roundIndex + 1;

    if (nextIndex >= wordList.length) {
      setFinished(true);
      return;
    }

    const nextChallenge = wordList[nextIndex];

    setRoundIndex(nextIndex);
    setTiles(shuffleLetters(nextChallenge.word));
    setSlots(Array(nextChallenge.word.length).fill(null));
    setFeedback("");
    setSolved(false);
  }

  // Tela de conclusão.
  if (finished) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] p-6 text-white">
        <Duck state="celebrating" className="w-48 h-48" />

        <h1 className="mt-4 text-4xl font-bold text-[#FF3B20] text-center">
          Parabéns!
        </h1>

        <p className="mt-4 text-xl text-center">
          Você concluiu todos os desafios!
        </p>

        <p className="mt-3 text-2xl font-bold">
          Pontuação: {score} pontos
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-8 rounded-xl bg-[#FF3B20] px-8 py-3 font-bold text-black transition hover:scale-105"
        >
          Voltar às dificuldades
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#0F172A] p-6 text-white">

      {/* Cabeçalho */}
      <div className="flex w-full max-w-4xl items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-gray-600 px-4 py-2 transition hover:bg-gray-700"
        >
          ← Voltar
        </button>

        <span className="font-bold text-[#FF3B20]">
          JuruDuck
        </span>

        <span className="text-sm font-bold">
          ⭐ {score} pontos
        </span>
      </div>

      {/* Informações do desafio */}
      <div className="mt-8 w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-[#FF3B20]">
          Vamos formar palavras!
        </h1>

        <p className="mt-2 text-gray-300">
          Dificuldade: {difficulty}
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Desafio {roundIndex + 1} de {wordList.length}
        </p>
      </div>

      {/* Duck e dica */}
      <div className="mt-4 flex flex-col items-center">
        <Duck
          state={solved ? "happy" : "idle"}
          className="h-40 w-40"
        />

        <div className="mt-2 rounded-2xl border border-gray-700 bg-[#172033] px-6 py-4 text-center">
          <p className="text-sm text-gray-400">
            Dica do Duck:
          </p>

          <p className="mt-1 text-lg font-semibold">
            {currentChallenge.hint}
          </p>
        </div>
      </div>

      {/* Espaços para montar a palavra */}
      <div className="mt-8 flex max-w-full flex-wrap justify-center gap-2">
        {slots.map((tileId, index) => {
          const letter = tiles.find(
            (tile) => tile.id === tileId
          )?.letter;

          return (
            <button
              key={index}
              type="button"
              data-slot-index={index}
              onClick={() => removeTile(index)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl font-bold transition sm:h-14 sm:w-14 ${
                letter
                  ? "border-[#FF3B20] bg-[#FF3B20] text-black"
                  : "border-dashed border-gray-500 bg-[#172033] text-gray-500"
              }`}
              aria-label={`Espaço ${index + 1}${letter ? `, letra ${letter}` : ", vazio"}`}
            >
              {letter ?? ""}
            </button>
          );
        })}
      </div>

      {/* Letras embaralhadas */}
      <div className="mt-8 flex max-w-xl flex-wrap justify-center gap-3">
        {tiles.map((tile) => {
          const isUsed = usedTiles.includes(tile.id);

          return (
            <button
              key={tile.id}
              type="button"
              disabled={isUsed || solved}
              onPointerDown={(event) =>
                handlePointerDown(event, tile.id)
              }
              onPointerUp={(event) =>
                handlePointerUp(event, tile.id)
              }
              onPointerCancel={() => setDraggingTile(null)}
              className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold transition select-none touch-none ${
                isUsed
                  ? "cursor-default bg-gray-700 text-gray-500 opacity-30"
                  : draggingTile === tile.id
                  ? "scale-110 bg-purple-400 text-black"
                  : "cursor-grab bg-[#FF3B20] text-black shadow-lg hover:scale-110 active:cursor-grabbing"
              }`}
            >
              {tile.letter}
            </button>
          );
        })}
      </div>

      {/* Mensagem de feedback */}
      <p
        className={`mt-6 min-h-7 text-center font-semibold ${
          solved ? "text-green-400" : "text-yellow-300"
        }`}
        aria-live="polite"
      >
        {feedback}
      </p>

      {/* Botões */}
      <div className="mt-3 flex flex-wrap justify-center gap-4">
        {!solved ? (
          <button
            type="button"
            onClick={checkWord}
            className="rounded-xl bg-[#FF3B20] px-8 py-3 font-bold text-black transition hover:scale-105 hover:bg-orange-400"
          >
            Verificar palavra
          </button>
        ) : (
          <button
            type="button"
            onClick={nextWord}
            className="rounded-xl bg-green-400 px-8 py-3 font-bold text-black transition hover:scale-105"
          >
            {roundIndex + 1 === wordList.length
              ? "Finalizar jogo"
              : "Próxima palavra →"}
          </button>
        )}
      </div>
    </main>
  );
}
