"use client";

import { useRef } from "react";

export default function BlogWave() {
  const blueWaveRef =
    useRef<SVGGElement | null>(null);
  const greenWaveRef =
    useRef<SVGGElement | null>(null);
  const violetWaveRef =
    useRef<SVGGElement | null>(null);

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
        rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) /
        rect.height -
      0.5;

    if (blueWaveRef.current) {
      blueWaveRef.current.style.transform =
        `translate(${x * 18}px, ${y * 8}px)`;
    }

    if (greenWaveRef.current) {
      greenWaveRef.current.style.transform =
        `translate(${x * -13}px, ${y * -6}px)`;
    }

    if (violetWaveRef.current) {
      violetWaveRef.current.style.transform =
        `translate(${x * 9}px, ${y * 5}px)`;
    }
  }

  function resetPointerEffect() {
    if (blueWaveRef.current) {
      blueWaveRef.current.style.transform =
        "translate(0px, 0px)";
    }

    if (greenWaveRef.current) {
      greenWaveRef.current.style.transform =
        "translate(0px, 0px)";
    }

    if (violetWaveRef.current) {
      violetWaveRef.current.style.transform =
        "translate(0px, 0px)";
    }
  }

  return (
    <div
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointerEffect}
      className="absolute inset-x-0 bottom-0 h-40 overflow-hidden sm:h-44 lg:h-52"
    >
      <div className="absolute inset-x-0 bottom-0 h-full">
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient
              id="blog-wave-blue"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#2563eb"
                stopOpacity="0.10"
              />
              <stop
                offset="50%"
                stopColor="#38bdf8"
                stopOpacity="0.30"
              />
              <stop
                offset="100%"
                stopColor="#2563eb"
                stopOpacity="0.08"
              />
            </linearGradient>

            <linearGradient
              id="blog-wave-green"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#10b981"
                stopOpacity="0.04"
              />
              <stop
                offset="55%"
                stopColor="#34d399"
                stopOpacity="0.22"
              />
              <stop
                offset="100%"
                stopColor="#10b981"
                stopOpacity="0.12"
              />
            </linearGradient>

            <linearGradient
              id="blog-wave-violet"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#8b5cf6"
                stopOpacity="0.02"
              />
              <stop
                offset="55%"
                stopColor="#8b5cf6"
                stopOpacity="0.12"
              />
              <stop
                offset="100%"
                stopColor="#2563eb"
                stopOpacity="0.04"
              />
            </linearGradient>
          </defs>

          <g
            ref={blueWaveRef}
            className="transition-transform duration-300 ease-out"
          >
            <path
              fill="url(#blog-wave-blue)"
              d="M0 145 C220 80 430 188 700 120 C960 55 1160 150 1440 95 L1440 220 L0 220 Z"
            >
              <animate
                attributeName="d"
                dur="9s"
                repeatCount="indefinite"
                values="
                  M0 145 C220 80 430 188 700 120 C960 55 1160 150 1440 95 L1440 220 L0 220 Z;
                  M0 115 C240 175 480 70 720 135 C990 195 1190 65 1440 125 L1440 220 L0 220 Z;
                  M0 145 C220 80 430 188 700 120 C960 55 1160 150 1440 95 L1440 220 L0 220 Z
                "
              />
            </path>
          </g>

          <g
            ref={greenWaveRef}
            className="transition-transform duration-500 ease-out"
          >
            <path
              fill="url(#blog-wave-green)"
              d="M0 170 C240 115 455 205 735 150 C1010 95 1215 170 1440 135 L1440 220 L0 220 Z"
            >
              <animate
                attributeName="d"
                dur="11s"
                repeatCount="indefinite"
                values="
                  M0 170 C240 115 455 205 735 150 C1010 95 1215 170 1440 135 L1440 220 L0 220 Z;
                  M0 142 C270 200 500 120 760 168 C1015 215 1225 108 1440 158 L1440 220 L0 220 Z;
                  M0 170 C240 115 455 205 735 150 C1010 95 1215 170 1440 135 L1440 220 L0 220 Z
                "
              />
            </path>
          </g>

          <g
            ref={violetWaveRef}
            className="transition-transform duration-700 ease-out"
          >
            <path
              fill="url(#blog-wave-violet)"
              d="M0 188 C275 148 490 215 780 176 C1050 140 1240 195 1440 164 L1440 220 L0 220 Z"
            >
              <animate
                attributeName="d"
                dur="13s"
                repeatCount="indefinite"
                values="
                  M0 188 C275 148 490 215 780 176 C1050 140 1240 195 1440 164 L1440 220 L0 220 Z;
                  M0 165 C250 208 530 150 805 190 C1080 220 1240 148 1440 182 L1440 220 L0 220 Z;
                  M0 188 C275 148 490 215 780 176 C1050 140 1240 195 1440 164 L1440 220 L0 220 Z
                "
              />
            </path>
          </g>
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
    </div>
  );
}
