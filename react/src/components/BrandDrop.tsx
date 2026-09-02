export function BrandDrop({ id = 'bd' }: { id?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <defs>
        <radialGradient id={id} cx="35%" cy="28%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="50%" stopColor="#C2ECF6" />
          <stop offset="100%" stopColor="#6EC9E0" />
        </radialGradient>
      </defs>
      <path
        d="M50 8 C68 34 84 48 84 63 A34 34 0 0 1 16 63 C16 48 32 34 50 8 Z"
        fill={`url(#${id})`}
      />
      <ellipse cx="37" cy="53" rx="9" ry="12" fill="#fff" opacity={0.8} />
    </svg>
  )
}
