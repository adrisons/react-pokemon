import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "@features/pokemon-list/components/Navbar/Navbar";
import { cn } from "@shared/lib/utils";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "inline-flex items-center min-h-10 px-3 rounded-md text-label font-pixel tracking-[0.12em] uppercase transition-colors",
    "text-text-muted hover:text-accent-gold",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900",
    isActive && "text-accent-gold"
  );

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <header className="sticky top-0 z-50 w-full bg-dark-900/90 border-b border-dark-600 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
          <Navbar />
          <nav aria-label="Primary sections" className="flex items-center gap-1" data-testid="primary-sections-nav">
            <NavLink to="/react-pokemon/" end className={navLinkClass} data-testid="nav-link-list">
              Collection
            </NavLink>
            <NavLink to="/react-pokemon/compare" className={navLinkClass} data-testid="nav-link-compare">
              Compare
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="main-content" className="flex-1 pt-6 pb-20">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
