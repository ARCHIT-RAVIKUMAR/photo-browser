import { memo } from 'react';
import { useObjectUrl } from '../hooks/useObjectUrl.js';

// Mounted only while visible, so the object URL lives only as long as the cell.
function PhotoCell({ photo, index, style, onOpen }) {
  const url = useObjectUrl(photo.file);
  return (
    <button className="cell" style={style} onClick={() => onOpen(index)} title={photo.path}>
      {url && <img src={url} alt={photo.name} decoding="async" draggable={false} />}
    </button>
  );
}
export default memo(PhotoCell);
