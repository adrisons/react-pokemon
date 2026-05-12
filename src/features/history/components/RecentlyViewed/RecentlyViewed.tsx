import { useCallback, useEffect, useState, type CSSProperties } from "react";
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
  const typeColor = primaryType ? typeColors[primaryType] : "var(--color-text-muted)";

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`recently-viewed-${entry.id}`}
      style={{ "--type-color": typeColor } as CSSProperties}
      className="group pkm-history-card relative h-32 w-28 flex flex-col items-center rounded-xl overflow-hidden border shadow-[0_2px_12px_rgba(0,0,0,0.4)] cursor-pointer transition-all duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.03] motion-safe:active:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900"
    >
      <div
        className="pkm-history-card-glow absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full flex-1 flex items-center justify-center pt-2">
        <img
          src={entry.imageUrl ?? cardBack}
          alt={entry.name}
          className="pkm-history-card-image w-14 h-14 object-contain transition-transform duration-200 motion-safe:group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = cardBack;
          }}
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center gap-1 px-2 pb-2">
        <span className="font-pixel text-caption font-bold tracking-[0.12em] text-accent-gold/75">
          #{String(entry.id).padStart(3, "0")}
        </span>
        <span className="capitalize text-label font-semibold text-text-primary text-center leading-tight max-w-full truncate w-full">
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
    <section aria-labelledby="recently-viewed-heading" data-testid="recently-viewed-carousel">
      <h2
        id="recently-viewed-heading"
        className="flex items-center justify-center gap-3 text-h3 uppercase tracking-[0.16em] text-accent-gold font-pixel mb-6"
      >
        <span className="inline-block w-3 h-0.5 rounded-full bg-accent-gold/40" aria-hidden="true" />
        Recently Viewed
        <span className="inline-block w-3 h-0.5 rounded-full bg-accent-gold/40" aria-hidden="true" />
      </h2>

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
