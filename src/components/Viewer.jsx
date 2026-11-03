import { useEffect, useState } from 'react';
import { useObjectUrl } from '../hooks/useObjectUrl.js';
import { formatBytes } from '../utils/files.js';

export default function Viewer({ photos, index, onChange, onClose }) {
  const photo = photos[index];
  const url = useObjectUrl(photo.file);
  const [dims, setDims] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => { setDims(null); setFailed(false); }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onChange(Math.min(photos.length - 1, index + 1));
      else if (e.key === 'ArrowLeft') onChange(Math.max(0, index - 1));
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, photos.length, onChange, onClose]);

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={photo.name}>
      <div className="stage">
        <button className="nav prev" disabled={index === 0} onClick={() => onChange(index - 1)} aria-label="Previous photo">‹</button>
        {failed ? (
          <p className="error">This image couldn’t be decoded. The file may be corrupt.</p>
        ) : (
          url && (
            <img
              src={url}
              alt={photo.name}
              onLoad={(e) => setDims({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              onError={() => setFailed(true)}
            />
          )
        )}
        <button className="nav next" disabled={index === photos.length - 1} onClick={() => onChange(index + 1)} aria-label="Next photo">›</button>
      </div>
      <aside className="meta">
        <button className="btn" onClick={onClose}>Close</button>
        <dl>
          <dt>Name</dt><dd>{photo.name}</dd>
          <dt>Path</dt><dd>{photo.path}</dd>
          <dt>Size</dt><dd>{formatBytes(photo.size)}</dd>
          <dt>Dimensions</dt><dd>{dims ? `${dims.w} × ${dims.h}` : failed ? 'Unknown' : 'Loading…'}</dd>
          <dt>Type</dt><dd>{photo.file.type || 'Unknown'}</dd>
          <dt>Modified</dt><dd>{new Date(photo.file.lastModified).toLocaleString()}</dd>
          <dt>Position</dt><dd>{index + 1} of {photos.length.toLocaleString()}</dd>
        </dl>
        <p className="hint">Use ← and → to move, Esc to close.</p>
      </aside>
    </div>
  );
}
