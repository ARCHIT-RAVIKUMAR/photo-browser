import { useRef } from 'react';

// Two entry points:
//  - folder: <input webkitdirectory> picks a whole folder (nested files included).
//  - files: a normal file dialog that shows images and allows multi-select.
export default function FolderPicker({ onFiles, compact = false }) {
  const folderRef = useRef(null);
  const filesRef = useRef(null);

  const handle = (e) => {
    // Copy first: resetting the input below empties the live FileList.
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // allow re-selecting the same selection
    onFiles(files);
  };

  const cls = compact ? 'btn' : 'btn btn-primary';
  return (
    <div className="picker">
      <input ref={folderRef} type="file" hidden multiple webkitdirectory="" directory="" onChange={handle} />
      <input ref={filesRef} type="file" hidden multiple accept="image/*" onChange={handle} />
      <button className={cls} onClick={() => folderRef.current?.click()}>
        {compact ? 'Open folder' : 'Choose a folder'}
      </button>
      <button className="btn" onClick={() => filesRef.current?.click()}>
        {compact ? 'Choose photos' : 'Or pick photos'}
      </button>
    </div>
  );
}
