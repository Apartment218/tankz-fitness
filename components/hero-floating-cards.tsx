"use client";

import { useEffect, useState } from "react";

type FloatingCard = {
  eyebrow: string;
  value: string;
};

type HeroFloatingCardsProps = {
  cards: FloatingCard[];
};

const positions = [
  "right-5 top-24 xl:right-10 xl:top-28",
  "right-5 top-[46%] xl:right-14",
  "left-5 bottom-8 xl:left-10 xl:bottom-12",
];

export function HeroFloatingCards({
  cards,
}: HeroFloatingCardsProps) {
  const [pointer, setPointer] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      setPointer({
        x:
          (event.clientX / window.innerWidth - 0.5) *
          2,
        y:
          (event.clientY / window.innerHeight - 0.5) *
          2,
      });
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );
    };
  }, []);

  const visibleCards = cards.slice(0, 3);

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
    >
      {visibleCards.map((card, index) => {
        const strength = 5 + index * 3;

        return (
          <div
            key={`${card.eyebrow}-${card.value}`}
            className={`absolute ${positions[index]}`}
            style={{
              transform: `translate3d(${
                pointer.x * strength
              }px, ${pointer.y * strength}px, 0)`,
              transition:
                "transform 160ms ease-out",
            }}
          >
            <div
              className="w-44 rounded-2xl border border-white/15 bg-black/45 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl xl:w-52 xl:px-5 xl:py-4"
              style={{
                animation: `heroFloat ${
                  5 + index * 0.7
                }s ease-in-out ${index * 0.45}s infinite`,
              }}
            >
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-red-400 xl:text-[10px]">
                {card.eyebrow}
              </p>

              <p className="mt-1.5 text-lg font-black leading-tight text-white xl:text-xl">
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}