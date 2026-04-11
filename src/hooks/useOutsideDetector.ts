import { useEffect, useRef } from "react";

export const useOutsideDetector = (
  callback: (event: MouseEvent) => void
) => {
  const ref = useRef<any>(undefined);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // @ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, callback]);

  return ref;
};



export const useInnerOuterDetector = (
  callback: (event: MouseEvent) => void
) => {
  const inner = useRef<any>(undefined);
  const outer = useRef<any>(undefined);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (inner.current && outer.current && event.target === outer.current) {
        callback(event);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [inner, outer, callback]);

  return { inner, outer };
}