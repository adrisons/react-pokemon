import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { key } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [key]);

  return null;
}

export default ScrollToTop;
