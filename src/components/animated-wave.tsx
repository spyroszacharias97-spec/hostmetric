export default function AnimatedWave() {
  const lines = Array.from({ length: 26 });

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[470px] overflow-hidden">
      <svg
        viewBox="0 0 1600 470"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="wave-gradient"
            x1="0"
            y1="0"
            x2="1600"
            y2="0"
          >
            <stop
              offset="0%"
              stopColor="#38bdf8"
              stopOpacity="0.30"
            />

            <stop
              offset="20%"
              stopColor="#0ea5e9"
              stopOpacity="0.72"
            />

            <stop
              offset="50%"
              stopColor="#38bdf8"
              stopOpacity="0.95"
            />

            <stop
              offset="80%"
              stopColor="#0284c7"
              stopOpacity="0.75"
            />

            <stop
              offset="100%"
              stopColor="#38bdf8"
              stopOpacity="0.30"
            />
          </linearGradient>
        </defs>

        {lines.map((_, index) => {
          const offset = index * 7;

          return (
            <path
              key={index}
              d={`
                M -120 ${135 + offset}
                C 220 ${15 + offset}
                  500 ${355 + offset}
                  810 ${175 + offset}
                C 1110 ${5 + offset}
                  1340 ${345 + offset}
                  1710 ${120 + offset}
              `}
              fill="none"
              stroke="url(#wave-gradient)"
              strokeWidth={index < 8 ? 3.8 : index < 17 ? 3 : 2.4}
              opacity={0.92 - index * 0.015}
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                dur={`${6.5 + index * 0.12}s`}
                repeatCount="indefinite"
                values={`
                  M -120 ${135 + offset}
                  C 220 ${15 + offset}
                    500 ${355 + offset}
                    810 ${175 + offset}
                  C 1110 ${5 + offset}
                    1340 ${345 + offset}
                    1710 ${120 + offset};

                  M -120 ${175 + offset}
                  C 260 ${90 + offset}
                    520 ${285 + offset}
                    850 ${130 + offset}
                  C 1160 ${-20 + offset}
                    1390 ${390 + offset}
                    1710 ${165 + offset};

                  M -120 ${115 + offset}
                  C 190 ${-10 + offset}
                    470 ${400 + offset}
                    780 ${205 + offset}
                  C 1080 ${35 + offset}
                    1300 ${300 + offset}
                    1710 ${95 + offset};

                  M -120 ${135 + offset}
                  C 220 ${15 + offset}
                    500 ${355 + offset}
                    810 ${175 + offset}
                  C 1110 ${5 + offset}
                    1340 ${345 + offset}
                    1710 ${120 + offset}
                `}
              />
            </path>
          );
        })}
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/20 via-transparent to-white/20" />
    </div>
  );
}