import { useRef } from 'react';

// Two entry points:
//  - folder: <input webkitdirectory> picks a whole folder (nested files included).
//    Browsers' folder dialogs hide or grey out files; you open the folder and confirm.
//  - files: a normal file dialog that shows images and allows multi-select.
export default function FolderPicker({ onFiles, compact = false }) {
  const folderRef = useRef(null);
  const filesRef = useRef(null);

  const handle = (e) => {
    const files = e.target.files;
    if (files && files.length) onFiles(files);
    e.target.value = ''; // allow re-selecting the same selection
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
