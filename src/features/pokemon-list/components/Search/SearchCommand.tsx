import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@shared/ui/components/ui/command";
import { useSearchStore } from "@features/pokemon-list/store";
import { getPokemonIdFromUrl } from "@core/domain/pokemon";

const spriteUrl = (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

function SearchCommand() {
  const navigate = useNavigate();
  const { isOpen, close, query, setQuery, results, searching, notFound, reset } = useSearchStore();

  function handleOpenChange(open: boolean) {
    if (!open) close();
  }

  function goToDetail(id: string) {
    close();
    reset();
    navigate(`/react-pokemon/detail/${id}`);
  }

  function goToList(q: string) {
    close();
    const trimmed = q.trim();
    navigate(trimmed ? `/react-pokemon/?q=${encodeURIComponent(trimmed)}` : `/react-pokemon/`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;
    const exact = results.find((p) => p.name.toLowerCase() === trimmed);
    if (exact) {
      goToDetail(getPokemonIdFromUrl(exact.url));
    } else {
      goToList(query);
    }
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      title="Search Pokémon"
      description="Type a name to find a Pokémon"
      className="top-[18%] max-w-xl border border-dark-600 bg-dark-800/95 backdrop-blur-md shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]"
    >
      <Command shouldFilter={false} className="bg-transparent">
      <CommandInput
        value={query}
        onValueChange={setQuery}
        onKeyDown={handleKeyDown}
        placeholder="Search Pokémon by name…"
        data-testid="search-command-input"
        autoFocus
      />
      <CommandList className="max-h-[60vh]">
        {searching && (
          <div className="px-4 py-6 text-center text-sm text-text-muted">Searching…</div>
        )}

        {!searching && notFound && (
          <CommandEmpty data-testid="search-command-empty">
            <div className="px-2 py-6 text-center">
              <p className="text-sm text-text-primary">No Pokémon match “{query}”</p>
              <p className="mt-1 text-xs text-text-muted">Press Enter to open the list anyway</p>
            </div>
          </CommandEmpty>
        )}

        {!searching && !notFound && results.length > 0 && (
          <CommandGroup heading="Suggestions">
            {results.map((p) => {
              const id = getPokemonIdFromUrl(p.url);
              return (
                <CommandItem
                  key={id}
                  value={`${p.name}-${id}`}
                  onSelect={() => goToDetail(id)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer"
                  data-testid="search-command-item"
                >
                  <img
                    src={spriteUrl(id)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-9 shrink-0 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                  <div className="flex flex-1 items-baseline justify-between gap-3 min-w-0">
                    <span className="capitalize truncate text-sm font-medium text-text-primary">
                      {p.name}
                    </span>
                    <span className="font-pixel text-[0.7rem] text-accent-gold tracking-[0.05em] shrink-0">
                      #{id}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {!searching && !notFound && results.length === 0 && query.trim() === "" && (
          <div className="px-4 py-8 text-center text-sm text-text-muted">
            Start typing to search the Pokédex
          </div>
        )}
      </CommandList>
      </Command>
    </CommandDialog>
  );
}

export default SearchCommand;
