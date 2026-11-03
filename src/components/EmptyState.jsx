import FolderPicker from './FolderPicker.jsx';

export default function EmptyState({ onFiles, report, loading }) {
  let title = 'Open a folder of photos';
  let body = 'Everything stays on your device. Files are read in your browser and never uploaded.';

  if (loading) {
    title = 'Reading folder…';
    body = 'Large folders can take a moment to list.';
  } else if (report) {
    title = report.total === 0 ? 'That folder is empty' : 'No supported photos in that folder';
    const types = Object.entries(report.skippedTypes).slice(0, 5).map(([k, v]) => `${v} .${k}`).join(', ');
    body = report.total === 0
      ? 'Pick a folder that contains images (JPG, PNG, GIF, WebP, AVIF, BMP, SVG).'
      : `Found ${report.skipped} other files (${types}). Supported: JPG, PNG, GIF, WebP, AVIF, BMP, SVG.`;
  }

  return (
    <div className="empty">
      <h2>{title}</h2>
      <p>{body}</p>
      {!loading && <FolderPicker onFiles={onFiles} />}
    </div>
  );
}
