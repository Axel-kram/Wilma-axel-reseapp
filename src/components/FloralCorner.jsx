// Dekorativ pressad-blomma-illustration som placeras i hörn av sidan.
// Medvetet enkel/handritad känsla istället för ett tungt repeterande mönster.
export default function FloralCorner({ position = 'top-left', size = 140 }) {
  return (
    <svg
      className={`floral-corner ${position}`}
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Stjälk */}
      <path d="M10 130 C 30 100, 25 70, 45 40" stroke="#cfe8ff" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Blad */}
      <path d="M22 95 C 10 90, 5 78, 12 68 C 24 72, 28 84, 22 95 Z" fill="#cfe8ff" opacity="0.7" />
      <path d="M35 65 C 24 58, 22 46, 30 37 C 41 43, 43 56, 35 65 Z" fill="#cfe8ff" opacity="0.6" />

      {/* Blomma 1 (stor, magenta) */}
      <g transform="translate(45 38)">
        <ellipse cx="0" cy="-12" rx="9" ry="13" fill="#f8d7e8" />
        <ellipse cx="11" cy="-4" rx="9" ry="13" fill="#f8d7e8" transform="rotate(72)" />
        <ellipse cx="7" cy="9" rx="9" ry="13" fill="#f8d7e8" transform="rotate(144)" />
        <ellipse cx="-7" cy="9" rx="9" ry="13" fill="#f8d7e8" transform="rotate(216)" />
        <ellipse cx="-11" cy="-4" rx="9" ry="13" fill="#f8d7e8" transform="rotate(288)" />
        <circle cx="0" cy="0" r="6" fill="#d63384" />
      </g>

      {/* Blomma 2 (liten, knopp) */}
      <g transform="translate(18 62)">
        <ellipse cx="0" cy="-6" rx="5" ry="7" fill="#fdf0f6" />
        <ellipse cx="6" cy="-2" rx="5" ry="7" fill="#fdf0f6" transform="rotate(72)" />
        <ellipse cx="4" cy="5" rx="5" ry="7" fill="#fdf0f6" transform="rotate(144)" />
        <ellipse cx="-4" cy="5" rx="5" ry="7" fill="#fdf0f6" transform="rotate(216)" />
        <ellipse cx="-6" cy="-2" rx="5" ry="7" fill="#fdf0f6" transform="rotate(288)" />
        <circle cx="0" cy="0" r="3.5" fill="#d63384" opacity="0.8" />
      </g>

      {/* Liten knopp längst ner */}
      <circle cx="14" cy="118" r="4" fill="#d63384" opacity="0.5" />
    </svg>
  )
}
