import { useEffect, useRef, useState } from "react";

export function useWindowSize() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const timeoutId = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    const handleResize = () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}
