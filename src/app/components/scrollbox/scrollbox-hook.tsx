import { throttle } from "lodash";
import { RefObject, useCallback, useEffect, useState } from "react";

const timing = (1 / 60) * 1000;
const decay = (v: number) => -0.1 * ((1 / timing) ^ 4) + v;

// Based on: https://dev.to/murilovarela/an-easy-scroll-box-implementation-2b6a
export default function useScrollBox(scrollBoxRef: RefObject<HTMLDivElement>) {
  const scrollBoxCurrent = scrollBoxRef.current;
  const [clickStartX, setClickStartX] = useState<number>();
  const [scrollStartX, setScrollStartX] = useState<number>();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastScrollX, setLastScrollX] = useState(0);
  const [speed, setSpeed] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [momentum, setMomentum] = useState<number>(0);

  const handleLastScrollX = useCallback(
    throttle((screenX: number) => {
      setLastScrollX(screenX);
    }, timing),
    []
  );

  const handleMomentum = useCallback(
    throttle(nextMomentum => {
      if (scrollBoxRef.current === null) return;
      setMomentum(nextMomentum);
      scrollBoxRef.current.scrollLeft = scrollBoxRef.current.scrollLeft + nextMomentum * timing * direction;
    }, timing),
    [scrollBoxCurrent, direction]
  );

  useEffect(() => {
    if (direction !== 0) {
      if (momentum > 0 && !isDragging) {
        handleMomentum(decay(momentum));
      } else if (isDragging) {
        setMomentum(speed);
      } else {
        setDirection(0);
      }
    }
  }, [momentum, isDragging, speed, direction, handleMomentum]);

  useEffect(() => {
    if (scrollBoxRef.current) {
      const handleDragStart = (e: MouseEvent) => {
        if (scrollBoxRef.current === null) return;
        setClickStartX(e.screenX);
        setScrollStartX(scrollBoxRef.current.scrollLeft);
        setDirection(0);
      };
      const handleDragMove = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (clickStartX !== undefined && scrollStartX !== undefined) {
          if (scrollBoxRef.current === null) return;
          const touchDelta = clickStartX - e.screenX;
          scrollBoxRef.current.scrollLeft = scrollStartX + touchDelta;

          if (Math.abs(touchDelta) > 1) {
            setIsDragging(true);
            setDirection(touchDelta / Math.abs(touchDelta));
            setSpeed(Math.abs((lastScrollX - e.screenX) / timing));
            handleLastScrollX(e.screenX);
          }
        }
      };
      const handleDragEnd = () => {
        // if (isDragging && clickStartX !== undefined) {
        setClickStartX(undefined);
        setScrollStartX(undefined);
        setIsDragging(false);
        // }
      };

      if (scrollBoxRef.current.ontouchstart === undefined) {
        scrollBoxRef.current.onmousedown = handleDragStart;
        scrollBoxRef.current.onmousemove = handleDragMove;
        scrollBoxRef.current.onmouseup = handleDragEnd;
        scrollBoxRef.current.onmouseleave = handleDragEnd;
      }
    }
  }, [scrollBoxCurrent, clickStartX, lastScrollX, handleLastScrollX, scrollStartX, isDragging]);

  useEffect(() => {
    if (scrollBoxRef.current === null) return;
    const handleScroll = (e: WheelEvent) => {
      if (scrollBoxRef.current === null) return;
      scrollBoxRef.current.scrollLeft += e.deltaY;
    };

    if (scrollBoxRef.current.ontouchstart === undefined) {
      scrollBoxRef.current.onwheel = handleScroll;
    }
  }, [scrollBoxCurrent])

  return { clickStartX, scrollStartX, isDragging, direction, momentum, lastScrollX, speed };
}