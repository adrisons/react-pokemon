interface Props {
  gotoNextPage?: (() => void) | null;
  gotoPrevPage?: (() => void) | null;
}

function Pagination({ gotoNextPage, gotoPrevPage }: Props) {
  return (
    <div className="mt-8 w-full overflow-hidden">
      {gotoPrevPage && (
        <button className="float-left" onClick={gotoPrevPage}>Previous</button>
      )}
      {gotoNextPage && (
        <button className="float-right" onClick={gotoNextPage}>Next</button>
      )}
    </div>
  );
}

export default Pagination;
