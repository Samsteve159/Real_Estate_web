import { useEffect, useRef } from "react";

/**
 * For iframe embeds whose content grows (e.g. the valuation tool when results
 * render): attach the returned ref to the outer element and it posts its pixel
 * height to the parent window so the host page's embed.js can resize the iframe.
 * No-op visually when not framed.
 */
export function useEmbedAutoresize<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const post = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      window.parent?.postMessage({ type: "manifest-embed:height", height }, "*");
    };

    post();
    const ro = new ResizeObserver(post);
    ro.observe(el);
    window.addEventListener("load", post);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", post);
    };
  }, []);

  return ref;
}
