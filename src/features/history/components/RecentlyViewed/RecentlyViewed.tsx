import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import typeColors from "@shared/constants/typeColors";
import cardBack from "@shared/assets/pokemon-card-back.svg";
import { useHistory } from "@features/history/hooks/useHistory";
import type { HistoryEntry } from "@features/history/store/historyStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@shared/ui/components/ui/carousel";

function HistoryCard({ entry, onClick }: { entry: HistoryEntry; onClick: () => void }) {
  const primaryType = entry.types[0]?.typeName;
  const typeColor = primaryType ? typeColors[primaryType] : "#6868aa";

  return (
    <button
      onClick={onClick}
      data-testid={`recently-viewed-${entry.id}`}
      className="group relative h-32 w-28 flex flex-col items-center rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] active:scale-[1.01]"
      style={{
        borderColor: `${typeColor}40`,
        background: `linear-gradient(160deg, ${typeColor}15 0%, var(--color-dark-800, #13131f) 60%)`,
        boxShadow: `0 2px 12px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Type glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${typeColor}30 0%, transparent 70%)`,
          boxShadow: `0 0 20px ${typeColor}20`,
        }}
      />

      {/* Image */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center pt-2">
        <img
          src={entry.imageUrl ?? cardBack}
          alt={entry.name}
          className="w-14 h-14 object-contain transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5"
          style={{ filter: `drop-shadow(0 3px 8px ${typeColor}50)` }}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = cardBack;
          }}
        />
      </div>

      {/* Info */}
      <div className="relative z-10 w-full flex flex-col items-center gap-0.5 px-2 pb-2">
        <span
          className="text-[0.52rem] font-bold tracking-wider leading-none"
          style={{ fontFamily: "var(--font-pixel)", color: "var(--color-accent-gold)", opacity: 0.75 }}
        >
          #{String(entry.id).padStart(3, "0")}
        </span>
        <span
          className="capitalize text-[0.72rem] font-semibold text-center leading-tight max-w-full truncate w-full"
          style={{ fontFamily: "var(--font-elegant)", color: "var(--color-text-primary)" }}
        >
          {entry.name}
        </span>
      </div>
    </button>
  );
}

// Card width (112px) + gap (12px) for visible-count calculation.
const CARD_STRIDE = 124;

function RecentlyViewed() {
  const { entries } = useHistory();
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();

  // Trackpad horizontal scroll → Embla via raw pixel manipulation on the internal engine.
  // Moves location and target by the exact pixel delta so the carousel follows the finger 1:1.
  // Only intercepts when horizontal delta dominates to let vertical page-scroll through.
  useEffect(() => {
    if (!api) return;
    const node = api.rootNode();
    const listener = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const engine = api.internalEngine();
      const newTarget = engine.target.get() - e.deltaX;
      const clamped = Math.max(engine.limit.min, Math.min(engine.limit.max, newTarget));
      engine.target.set(clamped);
      engine.location.set(clamped);
      engine.scrollBody.useDuration(0).useFriction(0);
      // Sync the active snap index to the closest snap so arrow state stays correct.
      const snaps = engine.scrollSnaps;
      const closest = snaps.reduce((best, snap, i) =>
        Math.abs(snap - clamped) < Math.abs(snaps[best] - clamped) ? i : best, 0);
      engine.index.set(closest);
      engine.indexPrevious.set(closest);
      engine.animation.start();
      api.emit("select");
    };
    node.addEventListener("wheel", listener, { passive: false });
    return () => node.removeEventListener("wheel", listener);
  }, [api]);

  // Scroll by (visible cards − 1) when clicking the arrows.
  const scrollByPage = useCallback(
    (direction: 1 | -1) => {
      if (!api) return;
      const viewportWidth = api.rootNode().offsetWidth;
      const visibleCount = Math.max(1, Math.floor(viewportWidth / CARD_STRIDE));
      const step = Math.max(1, visibleCount - 1);
      const target = api.selectedScrollSnap() + direction * step;
      const snaps = api.scrollSnapList();
      const clamped = Math.max(0, Math.min(snaps.length - 1, target));
      api.scrollTo(clamped);
    },
    [api],
  );

  if (entries.length === 0) return null;

  return (
    <section className="mb-10" aria-label="Recently viewed Pokémon" data-testid="recently-viewed-carousel">
      <h2 className="flex items-center justify-center gap-2.5 text-[0.85rem] uppercase tracking-[0.14em] text-accent-gold/90 font-pixel mb-5">
        <span className="inline-block w-4 h-[2px] rounded-full bg-accent-gold/40" aria-hidden="true" />
        Recently Viewed
        <span className="inline-block w-4 h-[2px] rounded-full bg-accent-gold/40" aria-hidden="true" />
      </h2>

      {/*
        No horizontal padding on the Carousel wrapper so it aligns with the grid.
        The arrows are overlaid inside the viewport with a semi-transparent backdrop.
        py-2 + overflow-visible so the hover scale on cards isn't clipped.
      */}
      <Carousel
        opts={{ align: "start", dragFree: true }}
        setApi={setApi}
        className="w-full overscroll-x-contain overflow-hidden"
      >
        <CarouselContent className="py-4 -ml-3 px-2">
          {entries.map((entry) => (
            <CarouselItem key={entry.id} className="pl-3 basis-auto">
              <HistoryCard
                entry={entry}
                onClick={() => navigate(`/react-pokemon/detail/${entry.id}`)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/*
          Full-height blocking overlays: cover the entire left/right edge so cards
          behind the arrow zone are never reachable (z-10 cards + transform hover
          can leak outside the arrow button's rounded bounds).
          The arrow button sits on top of the overlay (z-30 > z-20).
        */}
        <div className="absolute left-0 top-0 h-full w-10 z-20 pointer-events-auto" aria-hidden="true" />
        <div className="absolute right-0 top-0 h-full w-10 z-20 pointer-events-auto" aria-hidden="true" />

        <CarouselPrevious
          onClick={(e) => { e.preventDefault(); scrollByPage(-1); }}
          className="left-0 top-1/2 -translate-y-1/2 h-32 w-10 rounded-lg border-0 bg-dark-800/60 backdrop-blur-sm text-accent-gold hover:bg-dark-700/80 hover:text-accent-gold disabled:opacity-0 shadow-none z-30"
        />
        <CarouselNext
          onClick={(e) => { e.preventDefault(); scrollByPage(1); }}
          className="right-0 top-1/2 -translate-y-1/2 h-32 w-10 rounded-lg border-0 bg-dark-800/60 backdrop-blur-sm text-accent-gold hover:bg-dark-700/80 hover:text-accent-gold disabled:opacity-0 shadow-none z-30"
        />
      </Carousel>
    </section>
  );
}

export default RecentlyViewed;
