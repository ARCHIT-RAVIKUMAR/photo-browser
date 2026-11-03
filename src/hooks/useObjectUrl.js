import { useEffect, useState } from 'react';

// Creates an object URL for a File while the component is mounted and
// revokes it on unmount/change, so memory is bounded by what's on screen.
export function useObjectUrl(file) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) return;
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => { URL.revokeObjectURL(u); setUrl(null); };
  }, [file]);
  return url;
}
