import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Fixed-cell grid virtualization.
 * Given container width/height, scrollTop and item count, it computes which
 * ROWS intersect the viewport (+ overscan) and returns only those.
 * Cost per scroll frame is O(visible rows), independent of total photos.
 */
export function useVirtualGrid({ count, width, height, minCell = 160, gap = 8, overscanRows = 3 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const raf = useRef(0);

  const columns = Math.max(1, Math.floor((width + gap) / (minCell + gap)));
  const cell = Math.max(0, (width - gap * (columns - 1)) / columns);
  const rowHeight = cell + gap;
  const rowCount = Math.ceil(count / columns);
  const totalHeight = rowCount * rowHeight;

  // Throttle scroll state updates to one per animation frame.
  const onScroll = useCallback((e) => {
    const top = e.currentTarget.scrollTop;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setScrollTop(top));
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const { startRow, endRow } = useMemo(() => {
    if (rowHeight <= 0) return { startRow: 0, endRow: -1 };
    const first = Math.floor(scrollTop / rowHeight) - overscanRows;
    const last = Math.ceil((scrollTop + height) / rowHeight) + overscanRows;
    return { startRow: Math.max(0, first), endRow: Math.min(rowCount - 1, last) };
  }, [scrollTop, rowHeight, height, rowCount, overscanRows]);

  const start = startRow * columns;
  const end = Math.min(count, (endRow + 1) * columns);

  return { columns, cell, rowHeight, totalHeight, start, end, onScroll, gap };
}
