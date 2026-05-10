interface Props {
  gotoNextPage?: (() => void) | null;
  gotoPrevPage?: (() => void) | null;
}

function Pagination({ gotoNextPage, gotoPrevPage }: Props) {
  return (
    <div className="mt-12 w-full flex justify-between items-center gap-4">
      {gotoPrevPage ? (
        <button
          onClick={gotoPrevPage}
          className="pokemon-pagination-btn pokemon-pagination-prev"
          data-testid="pagination-prev-btn"
        >
          <span className="pagination-arrow">←</span>
          <span>Previous</span>
        </button>
      ) : (
        <div />
      )}
      {gotoNextPage && (
        <button
          onClick={gotoNextPage}
          className="pokemon-pagination-btn pokemon-pagination-next"
          data-testid="pagination-next-btn"
        >
          <span>Next</span>
          <span className="pagination-arrow">→</span>
        </button>
      )}
    </div>
  );
}

export default Pagination;
