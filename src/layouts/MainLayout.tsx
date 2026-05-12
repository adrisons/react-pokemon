import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Navbar from "@features/pokemon-list/components/Navbar/Navbar";
import { cn } from "@shared/lib/utils";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "inline-flex items-center min-h-10 px-3 rounded-md text-label font-pixel tracking-[0.12em] uppercase transition-colors",
    "text-text-muted hover:text-accent-gold",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900",
    isActive && "text-accent-gold"
  );

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center min-h-11 px-4 rounded-lg text-label font-pixel tracking-[0.12em] uppercase transition-colors",
    "text-text-muted hover:text-accent-gold hover:bg-dark-700",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold",
    isActive && "text-accent-gold bg-dark-700"
  );

function MainLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => { closeMenu(); }, [location.pathname, closeMenu]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen, closeMenu]);

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <header className="sticky top-0 z-50 w-full bg-dark-900/90 border-b border-dark-600 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-3 sm:gap-4">
          <Navbar />

          {/* Desktop nav */}
          <nav
            aria-label="Primary sections"
            className="ml-auto hidden sm:flex items-center gap-1"
            data-testid="primary-sections-nav"
          >
            <NavLink to="/react-pokemon/" end className={navLinkClass} data-testid="nav-link-list">
              Collection
            </NavLink>
            <NavLink to="/react-pokemon/compare" className={navLinkClass} data-testid="nav-link-compare">
              Compare
            </NavLink>
          </nav>

          {/* Mobile menu toggle */}
          <div className="ml-auto sm:hidden relative" ref={menuRef}>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={cn(
                "inline-flex items-center justify-center size-9 rounded-lg",
                "bg-dark-800 border border-dark-600 text-text-muted",
                "transition-colors duration-150 hover:text-accent-gold hover:border-accent-gold/60",
                "focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
              )}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>

            {mobileMenuOpen && (
              <nav
                aria-label="Primary sections"
                className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-dark-800 border border-dark-600 p-1.5 shadow-card motion-safe:animate-dropdown"
                data-testid="mobile-sections-nav"
              >
                <NavLink to="/react-pokemon/" end className={mobileNavLinkClass} data-testid="nav-link-list">
                  Collection
                </NavLink>
                <NavLink to="/react-pokemon/compare" className={mobileNavLinkClass} data-testid="nav-link-compare">
                  Compare
                </NavLink>
              </nav>
            )}
          </div>
        </div>
      </header>
      <main id="main-content" className="flex-1 pt-8 sm:pt-6 pb-20">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
