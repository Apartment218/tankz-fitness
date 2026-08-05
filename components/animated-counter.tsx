"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AnimatedCounterProps = {
  value: string;
  durationMs?: number;
  className?: string;
};

type ParsedValue = {
  prefix: string;
  number: number | null;
  suffix: string;
  decimals: number;
};

function parseValue(value: string): ParsedValue {
  const match = value.match(
    /^([^0-9-]*)(-?\d+(?:\.\d+)?)(.*)$/,
  );

  if (!match) {
    return {
      prefix: "",
      number: null,
      suffix: value,
      decimals: 0,
    };
  }

  const numericText = match[2];
  const decimals = numericText.includes(".")
    ? numericText.split(".")[1].length
    : 0;

  return {
    prefix: match[1],
    number: Number(numericText),
    suffix: match[3],
    decimals,
  };
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function AnimatedCounter({
  value,
  durationMs = 1400,
  className,
}: AnimatedCounterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  const parsed = useMemo(() => parseValue(value), [value]);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || hasStarted) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.45,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || parsed.number === null) {
      setDisplayValue(value);
      return;
    }

    let animationFrame = 0;
    const startedAt = performance.now();

    function animate(now: number) {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutCubic(progress);
      const current = parsed.number! * easedProgress;

      setDisplayValue(
        `${parsed.prefix}${current.toFixed(
          parsed.decimals,
        )}${parsed.suffix}`,
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [
    durationMs,
    hasStarted,
    parsed.decimals,
    parsed.number,
    parsed.prefix,
    parsed.suffix,
    value,
  ]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
}