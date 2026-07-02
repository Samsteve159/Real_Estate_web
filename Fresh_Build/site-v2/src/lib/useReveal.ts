import { useEffect, useRef } from "react";

/**
 * Attach to a container ref, all children with class "reveal"
 * get the "visible" class when they enter the viewport.
 * Respects prefers-reduced-motion (observer fires immediately).
 */
export function useReveal(threshold = 0.15) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>(".reveal");

    if (reduced) {
      targets.forEach(el => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold]);

  return containerRef;
}
