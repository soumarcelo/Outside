'use client'

import '@/app/lib/scrollbox.css';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import useScrollBox from './scrollbox-hook';
import { useMediaQuery } from 'react-responsive';

// Based on: https://dev.to/murilovarela/an-easy-scroll-box-implementation-2b6a
export default function ScrollBox({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const scrollDelta = 350;
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const childrenContainerRef = useRef<HTMLDivElement>(null);
  const { isDragging } = useScrollBox(scrollBoxRef);
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const scroll = (scrollOffset: number) => {
    if (scrollBoxRef.current === null) return;
    if (isDragging) return;
    scrollBoxRef.current.scrollLeft += scrollOffset;
  };

  const [hasScroll, setHasScroll] = useState<boolean>(false);
  useEffect(() => {
    if (scrollBoxRef.current?.scrollWidth === undefined) return;
    setHasScroll(scrollBoxRef.current?.scrollWidth > window.innerWidth);
  }, [children, isPortrait]);

  return (
    <div {...props}>
      <div className='scroll-box__overflow d-flex p-2' ref={scrollBoxRef} style={{ scrollBehavior: isDragging ? undefined : 'smooth', cursor: isDragging ? 'grabbing' : 'grab', width: hasScroll ? '100vw' : undefined}}>
        <div className='hstack gap-3' ref={childrenContainerRef} style={{ pointerEvents: isDragging ? 'none' : undefined }}>
          {children}
        </div>
      </div>
      <div className={'hstack gap-2 d-none d-sm-block'} style={{visibility: hasScroll ? 'visible' : 'hidden'}}>
        <button onClick={() => (scroll(-scrollDelta))} className='position-absolute top-50 start-0 translate-middle-y btn btn-primary rounded-5 mx-1'>{"<"}</button>
        <button onClick={() => (scroll(scrollDelta))} className='position-absolute top-50 end-0 translate-middle-y btn btn-primary rounded-5 mx-1'>{">"}</button>
      </div>
    </div>
  );
}