import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 p-4 dark:bg-zinc-950">
      <Link href="/" aria-label="Todos home">
        <Logo />
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {children}
      </div>
    </div>
  );
}
