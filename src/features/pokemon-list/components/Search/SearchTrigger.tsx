import { Search } from "lucide-react";
import { useSearchStore } from "@features/pokemon-list/store";
import { cn } from "@shared/lib/utils";

interface Props {
  className?: string;
}

function SearchTrigger({ className }: Props) {
  const open = useSearchStore((s) => s.open);

  return (
    <>
      {/* Compact icon button — visible on small screens */}
      <button
        type="button"
        aria-label="Open search"
        onClick={open}
        className={cn(
          "sm:hidden inline-flex items-center justify-center size-9 rounded-lg",
          "bg-dark-800 border border-dark-600 text-text-muted",
          "transition-colors duration-150 hover:text-accent-gold hover:border-accent-gold/60",
          "focus:outline-none focus:ring-2 focus:ring-accent-gold/40",
          className
        )}
        data-testid="search-trigger-icon"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>

      {/* Full input-style trigger — visible from sm up */}
      <button
        type="button"
        onClick={open}
        className={cn(
          "hidden sm:inline-flex items-center gap-2 w-56 md:w-72 h-9 px-3 rounded-lg",
          "bg-dark-800 border border-dark-600 text-text-muted text-sm text-left",
          "transition-all duration-150",
          "hover:border-accent-gold/50 hover:text-text-primary",
          "focus:outline-none focus:ring-2 focus:ring-accent-gold/40 focus:border-accent-gold/60",
          className
        )}
        data-testid="search-trigger"
      >
        <Search className="size-4 shrink-0 opacity-70" aria-hidden="true" />
        <span className="flex-1 truncate">Search Pokémon…</span>
        <kbd
          className="ml-auto inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded
            bg-dark-700 border border-dark-600 text-[0.65rem] font-pixel font-semibold
            tracking-[0.05em] text-text-muted shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
          aria-hidden="true"
        >
          ⌘K
        </kbd>
      </button>
    </>
  );
}

export default SearchTrigger;
