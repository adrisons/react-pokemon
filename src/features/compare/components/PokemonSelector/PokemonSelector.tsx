import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { usePokemonListStore } from "@features/pokemon-list/store";
import type { PokemonSummary } from "@core/domain/pokemon";
import { getPokemonIdFromUrl } from "@core/domain/pokemon";
import { cn } from "@shared/lib/utils";

interface Props {
  label: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

const DEBOUNCE_MS = 150;

function PokemonSelector({ label, selectedId, onSelect, onClear, disabled = false }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PokemonSummary[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const all = await usePokemonListStore.getState().loadAllPokemons();
        const lower = query.toLowerCase().trim();
        const idQuery = lower.replace(/^#/, "");
        const isNumeric = /^\d+$/.test(idQuery);
        const numericId = isNumeric ? String(Number(idQuery)) : "";
        const filtered = all
          .filter((p) => {
            if (isNumeric) {
              const id = getPokemonIdFromUrl(p.url);
              return id === numericId || id.startsWith(numericId) || p.name.toLowerCase().includes(lower);
            }
            return p.name.toLowerCase().includes(lower);
          })
          .slice(0, 8);
        setSuggestions(filtered);
        setOpen(filtered.length > 0);
        setActiveIndex(-1);
      } finally {
        setSearching(false);
      }
    }, DEBOUNCE_MS);
  }, [query]);

  function handleSelect(pokemon: PokemonSummary) {
    const id = getPokemonIdFromUrl(pokemon.url);
    onSelect(id);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  function handleBlur() {
    setTimeout(() => {
      setOpen(false);
      setActiveIndex(-1);
    }, 150);
  }

  const isSelected = Boolean(selectedId);

  return (
    <div className="relative flex flex-col gap-2" data-testid="pokemon-selector">
      <label className="text-caption tracking-[0.15em] uppercase text-text-muted font-pixel">
        {label}
      </label>

      {isSelected ? (
        <div className="flex items-center justify-between bg-accent-gold/7 border border-accent-gold/30 rounded-lg py-2 px-4 gap-2 motion-safe:animate-selector-chosen">
          <span className="text-label font-bold text-accent-gold tracking-[0.06em] font-pixel">
            #{String(selectedId).padStart(3, "0")}
          </span>
          <button
            type="button"
            className="inline-flex items-center justify-center size-6 rounded text-text-muted transition-colors duration-150 hover:text-text-primary hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
            onClick={onClear}
            aria-label="Remove selection"
            data-testid="selector-clear-btn"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-dark-700 border border-dark-600 rounded-lg py-2 px-4 text-body text-text-primary transition-all duration-200 focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/15 disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-text-muted placeholder:text-label"
            placeholder={disabled ? "Select the other Pokémon first" : "Name or #ID…"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={disabled}
            data-testid="selector-input"
            autoComplete="off"
          />
          {searching && <span className="absolute right-3 size-4 border-2 border-dark-600 border-t-accent-gold rounded-full motion-safe:animate-spin" />}
        </div>
      )}

      {open && (
        <ul
          ref={listRef}
          className="absolute top-[calc(100%+4px)] left-0 right-0 bg-dark-800 border border-dark-600 rounded-xl p-2 list-none m-0 z-50 shadow-[0_12px_32px_rgba(0,0,0,0.6)] motion-safe:animate-dropdown"
          role="listbox"
          data-testid="selector-dropdown"
        >
          {suggestions.map((p, i) => {
            const id = getPokemonIdFromUrl(p.url);
            return (
              <li
                key={p.name}
                role="option"
                aria-selected={i === activeIndex}
                className={cn(
                  "flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-colors duration-100 hover:bg-dark-700",
                  i === activeIndex && "bg-dark-700"
                )}
                onMouseDown={() => handleSelect(p)}
              >
                <span className="text-caption text-accent-gold tracking-wider w-12 shrink-0 font-pixel">
                  #{String(id).padStart(3, "0")}
                </span>
                <span className="text-label text-text-primary capitalize">{p.name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PokemonSelector;
