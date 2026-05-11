interface Props {
  gotoNextPage?: (() => void) | null;
  gotoPrevPage?: (() => void) | null;
}

const btnClass =
  "group relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 text-[#13131f] bg-[linear-gradient(135deg,#ffd700_0%,#ffed4e_100%)] border-2 border-[#ffed4e] shadow-[0_6px_20px_rgba(255,215,0,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] uppercase tracking-[0.05em] overflow-hidden hover:shadow-[0_10px_30px_rgba(255,215,0,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_3px_10px_rgba(255,215,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.2)] before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] before:[transition:left_0.5s_ease] hover:before:left-full";

function Pagination({ gotoNextPage, gotoPrevPage }: Props) {
  return (
    <div className="mt-12 w-full flex justify-between items-center gap-4">
      {gotoPrevPage ? (
        <button
          onClick={gotoPrevPage}
          className={`${btnClass} flex-row-reverse`}
          data-testid="pagination-prev-btn"
        >
          <span className="text-[1.1em] font-black relative z-[1]">←</span>
          <span className="relative z-[1]">Previous</span>
        </button>
      ) : (
        <div />
      )}
      {gotoNextPage && (
        <button
          onClick={gotoNextPage}
          className={btnClass}
          data-testid="pagination-next-btn"
        >
          <span className="relative z-[1]">Next</span>
          <span className="text-[1.1em] font-black relative z-[1]">→</span>
        </button>
      )}
    </div>
  );
}

export default Pagination;
