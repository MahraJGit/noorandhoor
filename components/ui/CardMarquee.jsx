"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

/**
 * Horizontal marquee with auto-scroll and manual drag/touch/wheel scroll.
 * Children are duplicated for a seamless loop; the copy is inert.
 */
export default function CardMarquee({
  children,
  className = "",
  duration = 40,
}) {
  const items = Children.toArray(children).filter(Boolean);
  const scrollerRef = useRef(null);
  const pausedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const resumeTimer = useRef(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });
  const [isDragging, setIsDragging] = useState(false);

  const wrapLoop = useEffectEvent((el) => {
    const half = el.scrollWidth / 2;
    if (half <= 0) return;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    else if (el.scrollLeft < 0) el.scrollLeft += half;
  });

  const pauseAuto = useEffectEvent(() => {
    pausedRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  });

  const scheduleResume = useEffectEvent((delay = 1800) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || items.length === 0) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return undefined;

    let frameId = 0;
    let last = performance.now();

    const tick = (now) => {
      const delta = Math.min(now - last, 32);
      last = now;

      if (!pausedRef.current && !dragState.current.active) {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          el.scrollLeft += (half / (duration * 1000)) * delta;
          wrapLoop(el);
        }
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [duration, items.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    const onWheel = () => {
      pauseAuto();
      scheduleResume();
      wrapLoop(el);
    };

    const onScroll = () => {
      if (dragState.current.active) return;
      wrapLoop(el);
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
    };
  }, [items.length]);

  if (!items.length) return null;

  const renderSet = (suffix, options = {}) =>
    items.map((child, index) => {
      const sourceKey =
        isValidElement(child) && child.key != null
          ? String(child.key)
          : `item-${index}`;

      return (
        <div
          key={`${sourceKey}-${suffix}`}
          className="card-marquee-item"
          aria-hidden={options.inert || undefined}
          inert={options.inert || undefined}
        >
          {child}
        </div>
      );
    });

  const handlePointerDown = (event) => {
    if (event.button != null && event.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    pauseAuto();
    el.setPointerCapture(event.pointerId);
    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragState.current.active) return;
    const el = scrollerRef.current;
    if (!el) return;

    const distance = event.clientX - dragState.current.startX;
    if (Math.abs(distance) > 4) dragState.current.moved = true;
    el.scrollLeft = dragState.current.scrollLeft - distance;
    wrapLoop(el);
  };

  const endDrag = (event) => {
    if (!dragState.current.active) return;
    const el = scrollerRef.current;
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }

    const wasDrag = dragState.current.moved;
    if (wasDrag) suppressClickRef.current = true;
    dragState.current.active = false;
    dragState.current.moved = false;
    setIsDragging(false);
    scheduleResume(wasDrag ? 2200 : 1200);
  };

  const handleClickCapture = (event) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  return (
    <div
      ref={scrollerRef}
      className={`card-marquee ${isDragging ? "is-dragging" : ""} ${className}`.trim()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={handleClickCapture}
      onMouseEnter={pauseAuto}
      onMouseLeave={() => {
        if (!dragState.current.active) scheduleResume(900);
      }}
    >
      <div className="card-marquee-track">
        {renderSet("a")}
        {renderSet("b", { inert: true })}
      </div>
    </div>
  );
}
