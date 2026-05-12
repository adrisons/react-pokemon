import { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "@shared/assets/pokemon-logo.png";
import { useSearchStore } from "@features/pokemon-list/store";
import SearchTrigger from "@features/pokemon-list/components/Search/SearchTrigger";
import SearchCommand from "@features/pokemon-list/components/Search/SearchCommand";

const Navbar = () => {
  const toggle = useSearchStore((s) => s.toggle);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <div
      className="flex items-center gap-3 sm:gap-4 py-3"
      data-testid="primary-nav"
    >
      <Link
        to="/react-pokemon/"
        aria-label="Go to Pokémon home"
        className="h-10 sm:h-12 block shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
      >
        <img
          src={logo}
          alt="Pokémon"
          className="h-full drop-shadow-[0_0_10px_rgba(255,215,0,0.35)]"
        />
      </Link>

      <SearchTrigger />
      <SearchCommand />
    </div>
  );
};

export default Navbar;
