import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border bg-primary text-primary-fg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="font-display text-xl tracking-tight">Provenance</span>
            <span className="hidden text-xs uppercase tracking-[0.18em] text-primary-fg/70 sm:inline">
              Originality
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" icon={<FileSearch className="size-4" />} label="Scan" />
            <NavLink to="/library" icon={<BookOpen className="size-4" />} label="Library" />
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

function NavLink({
  to,
  icon,
  label,
}: {
  to: "/" | "/library";
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-sm px-3 text-sm text-primary-fg/80",
        "transition-colors duration-150 hover:bg-primary-fg/10 hover:text-primary-fg",
      )}
      activeProps={{ className: "bg-primary-fg/12 text-primary-fg" }}
    >
      {icon}
      {label}
    </Link>
  );
}
