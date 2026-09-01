import { SVGProps } from 'react';

// Ilustração decorativa de um corte de cabelo (fade + tesoura em ação),
// usada na Home no lugar de uma foto, seguindo a identidade azul/preto.
export function BarberIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" {...props}>
      <defs>
        <clipPath id="bbb-head-clip">
          <circle cx="120" cy="132" r="72" />
        </clipPath>
      </defs>

      {/* Cabeça */}
      <circle cx="120" cy="132" r="72" className="fill-brand-blue-500/10 stroke-brand-blue-400/50" strokeWidth={2} />

      {/* Orelhas */}
      <circle cx="49" cy="136" r="10" className="fill-brand-blue-500/10 stroke-brand-blue-400/50" strokeWidth={2} />
      <circle cx="191" cy="136" r="10" className="fill-brand-blue-500/10 stroke-brand-blue-400/50" strokeWidth={2} />

      {/* Degradê (fade) — linhas com opacidade decrescente do topo para a base */}
      <g clipPath="url(#bbb-head-clip)">
        {Array.from({ length: 14 }).map((_, index) => {
          const y = 78 + index * 8;
          const opacity = 0.85 - index * 0.055;
          const width = 1 + index * 0.18;
          return (
            <line
              key={y}
              x1={54}
              y1={y}
              x2={186}
              y2={y}
              className="stroke-brand-blue-300"
              strokeWidth={width}
              opacity={Math.max(opacity, 0.08)}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Topo com corte texturizado */}
      <path
        d="M52 92 C 60 48, 90 30, 120 30 C 150 30, 180 48, 188 92
           C 178 82, 168 90, 158 80 C 150 92, 140 78, 130 90
           C 122 78, 112 90, 104 78 C 96 90, 86 80, 76 90
           C 68 80, 60 84, 52 92 Z"
        className="fill-brand-blue-400"
      />

      {/* Cabo/pente decorativo */}
      <rect x="30" y="196" width="70" height="10" rx="5" className="fill-brand-blue-500/20 stroke-brand-blue-400/50" strokeWidth={1.5} />
      {Array.from({ length: 8 }).map((_, index) => (
        <line
          key={index}
          x1={36 + index * 8}
          y1={206}
          x2={36 + index * 8}
          y2={216}
          className="stroke-brand-blue-400/60"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}

      {/* Tesoura em ação */}
      <g transform="translate(150 60) rotate(28)" className="stroke-brand-blue-300" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="0" cy="26" r="7" fill="none" />
        <circle cx="16" cy="26" r="7" fill="none" />
        <path d="M6 20 L44 -6" />
        <path d="M10 20 L44 6" />
      </g>

      {/* Aparas de cabelo caindo */}
      <g className="stroke-brand-blue-300" strokeWidth={2.5} strokeLinecap="round">
        <line x1="196" y1="70" x2="204" y2="80" opacity={0.7} />
        <line x1="205" y1="86" x2="212" y2="98" opacity={0.5} />
        <line x1="188" y1="98" x2="196" y2="108" opacity={0.35} />
      </g>
    </svg>
  );
}
