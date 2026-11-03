import { useCallback, useMemo, useState } from 'react';
import { scanFiles, sortPhotos, filterPhotos } from './utils/files.js';
import EmptyState from './components/EmptyState.jsx';
import StatsBar from './components/StatsBar.jsx';
import VirtualGrid from './components/VirtualGrid.jsx';
import Viewer from './components/Viewer.jsx';

export default function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [renderedCount, setRenderedCount] = useState(0);
  const [sortKey, setSortKey] = useState('name');
  const [query, setQuery] = useState('');

  const handleFiles = useCallback((fileList) => {
    setLoading(true);
    setOpenIndex(null);
    setQuery('');
    // Yield once so the "Reading folder…" state paints before the sync scan.
    setTimeout(() => {
      setReport(scanFiles(fileList));
      setLoading(false);
    }, 0);
  }, []);

  // The grid and the viewer both use this list, so indexes always agree.
  const shown = useMemo(
    () => (report ? sortPhotos(filterPhotos(report.photos, query), sortKey) : []),
    [report, query, sortKey]
  );

  const hasPhotos = report && report.photos.length > 0;

  return (
    <div className="app">
      {hasPhotos ? (
        <>
          <StatsBar
            report={report} shownCount={shown.length} renderedCount={renderedCount}
            sortKey={sortKey} onSort={setSortKey} query={query} onQuery={setQuery}
            onFiles={handleFiles}
          />
          {shown.length === 0 ? (
            <p className="no-match">No photos match “{query}”.</p>
          ) : (
            <VirtualGrid key={sortKey + query} photos={shown} onOpen={setOpenIndex} onRenderedCount={setRenderedCount} />
          )}
          {openIndex !== null && shown[openIndex] && (
            <Viewer photos={shown} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
          )}
        </>
      ) : (
        <EmptyState onFiles={handleFiles} report={report} loading={loading} />
      )}
    </div>
  );
}
