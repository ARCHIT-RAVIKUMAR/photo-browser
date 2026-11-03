import FolderPicker from './FolderPicker.jsx';

export default function StatsBar({ report, shownCount, renderedCount, sortKey, onSort, query, onQuery, onFiles }) {
  const total = report.photos.length;
  return (
    <header className="bar">
      <div className="counts">
        <strong>{shownCount === total ? total.toLocaleString() : `${shownCount.toLocaleString()} of ${total.toLocaleString()}`} photos</strong>
        <span className="muted">{renderedCount} in DOM{report.skipped > 0 && `, ${report.skipped.toLocaleString()} other files skipped`}</span>
      </div>
      <input className="field" type="search" placeholder="Filter by name or folder" value={query} onChange={(e) => onQuery(e.target.value)} aria-label="Filter photos" />
      <select className="field" value={sortKey} onChange={(e) => onSort(e.target.value)} aria-label="Sort photos">
        <option value="name">Name</option>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="size">Largest first</option>
      </select>
      <FolderPicker onFiles={onFiles} compact />
    </header>
  );
}
