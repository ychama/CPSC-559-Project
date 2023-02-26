import { useEffect, useRef } from "react";
// Interval function

export const useInterval = (onFinish, delay) => {
  const cb = useRef();

  const tick = () => {
    cb.current();
  };
  // setting function to call on interval finish
  useEffect(() => {
    cb.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    // Performs an onfinish function after each delay interval completes
    if (delay !== null) {
      // create timer
      const timer = setInterval(tick, delay);
      // function to clear timer
      return () => clearInterval(timer);
    }
  }, [delay]);
};
