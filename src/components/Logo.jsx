import { COLORS } from "../lib/colors.js";

export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="url(#logoGrad)" />
      <text
        x="20" y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="26"
        fontWeight="700"
      >Ψ</text>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor={COLORS.sage} />
          <stop offset="100%" stopColor={COLORS.terracotta} />
        </linearGradient>
      </defs>
    </svg>
  );
}
