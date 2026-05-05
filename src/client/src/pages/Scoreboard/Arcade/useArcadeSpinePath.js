import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const useArcadeSpinePath = ({ itemCount, controlsOpen }) => {
  const listRef = useRef(null);
  const nodeRefs = useRef([]);
  const [spinePathD, setSpinePathD] = useState("");

  const computeSpinePath = useCallback(() => {
    const listEl = listRef.current;
    if (!listEl) {
      setSpinePathD("");
      return;
    }

    const listRect = listEl.getBoundingClientRect();
    const points = nodeRefs.current
      .filter(Boolean)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - listRect.left + r.width / 2,
          y: r.top - listRect.top + r.height / 2,
        };
      })
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

    if (points.length < 2) {
      setSpinePathD("");
      return;
    }

    const totalHeight = listRect.height || 1;
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i += 1) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const yMid = (p0.y + p1.y) / 2;
      const progress = Math.max(0, Math.min(1, yMid / totalHeight));

      const baseAmplitudePx = 14;
      const extraAmplitudePx = 54;
      const amplitude = baseAmplitudePx + extraAmplitudePx * progress;
      const direction = i % 2 === 0 ? -1 : 1;
      const dx = direction * amplitude;

      d += ` C ${p0.x + dx} ${yMid}, ${p1.x + dx} ${yMid}, ${p1.x} ${p1.y}`;
    }

    setSpinePathD(d);
  }, []);

  useLayoutEffect(() => {
    nodeRefs.current.length = itemCount;
    computeSpinePath();
  }, [computeSpinePath, controlsOpen, itemCount]);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => computeSpinePath());
    observer.observe(listEl);
    return () => observer.disconnect();
  }, [computeSpinePath]);

  return {
    listRef,
    nodeRefs,
    spinePathD,
  };
};

export default useArcadeSpinePath;
