import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@shared/ui/components/ui/button";

interface Props {
  gotoNextPage?: (() => void) | null;
  gotoPrevPage?: (() => void) | null;
}

function Pagination({ gotoNextPage, gotoPrevPage }: Props) {
  return (
    <div className="w-full flex justify-between items-center gap-4" data-testid="pagination">
      {gotoPrevPage ? (
        <Button
          variant="primary"
          size="md"
          onClick={gotoPrevPage}
          data-testid="pagination-prev-btn"
        >
          <ArrowLeft aria-hidden="true" />
          <span>Previous</span>
        </Button>
      ) : (
        <div />
      )}
      {gotoNextPage && (
        <Button
          variant="primary"
          size="md"
          onClick={gotoNextPage}
          data-testid="pagination-next-btn"
        >
          <span>Next</span>
          <ArrowRight aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}

export default Pagination;
