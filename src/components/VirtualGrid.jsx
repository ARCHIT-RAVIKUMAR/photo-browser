import { useEffect } from 'react';
import { useElementSize } from '../hooks/useElementSize.js';
import { useVirtualGrid } from '../hooks/useVirtualGrid.js';
import PhotoCell from './PhotoCell.jsx';

export default function VirtualGrid({ photos, onOpen, onRenderedCount }) {
  const [ref, { width, height }] = useElementSize();
  const g = useVirtualGrid({ count: photos.length, width, height });
  const rendered = Math.max(0, g.end - g.start);

  useEffect(() => { onRenderedCount(rendered); }, [rendered, onRenderedCount]);

  const items = [];
  for (let i = g.start; i < g.end; i++) {
    const row = Math.floor(i / g.columns);
    const col = i % g.columns;
    items.push(
      <PhotoCell
        key={photos[i].id}
        photo={photos[i]}
        index={i}
        onOpen={onOpen}
        style={{
          position: 'absolute',
          width: g.cell,
          height: g.cell,
          transform: `translate(${col * (g.cell + g.gap)}px, ${row * g.rowHeight}px)`,
        }}
      />
    );
  }

  return (
    <div className="scroller" ref={ref} onScroll={g.onScroll}>
      {/* Spacer gives the scrollbar the full height; cells are absolutely placed. */}
      <div style={{ height: g.totalHeight, position: 'relative' }}>{width > 0 && items}</div>
    </div>
  );
}
