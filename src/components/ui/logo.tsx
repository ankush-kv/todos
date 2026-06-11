export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Todos logo"
      className={className}
    >
      <defs>
        <linearGradient
          id="todos-logo-gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#todos-logo-gradient)" />
      <path
        d="M9 16.5l4.5 4.5L23 11"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="size-7" />
      <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Todos
      </span>
    </span>
  );
}
