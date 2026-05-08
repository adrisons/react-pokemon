import { Button } from "@shared/ui/components/ui/button";

interface Props {
  gotoNextPage?: (() => void) | null;
  gotoPrevPage?: (() => void) | null;
}

function Pagination({ gotoNextPage, gotoPrevPage }: Props) {
  return (
    <div className="mt-8 w-full flex justify-between">
      {gotoPrevPage ? (
        <Button variant="outline" onClick={gotoPrevPage}>Previous</Button>
      ) : (
        <span />
      )}
      {gotoNextPage && (
        <Button variant="outline" onClick={gotoNextPage}>Next</Button>
      )}
    </div>
  );
}

export default Pagination;
