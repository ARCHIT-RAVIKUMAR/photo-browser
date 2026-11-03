# Virtualized Photo Browser

A client-side React app that browses folders of 20,000+ photos smoothly. Files are read locally via the browser's folder picker and are never uploaded.

**Live:** _add your Vercel/Netlify link_  ·  **Repo:** _add your GitHub link_

## Run it

```bash
npm install
npm run dev      # development
npm run build    # production build in dist/
```
Deploy `dist/` to Vercel, Netlify or GitHub Pages (build command `npm run build`, output `dist`).

## How virtualization works

`src/hooks/useVirtualGrid.js` implements a fixed-cell grid virtualizer:

1. `useElementSize` measures the scroll container with `ResizeObserver`.
2. Column count = how many `minCell`-wide cells fit; cell size stretches to fill the width, so cells stay square and rows have a constant height.
3. A spacer `div` is given the full height (`rows × rowHeight`) so the native scrollbar represents the whole folder.
4. On scroll (throttled to one update per animation frame) it computes the first and last visible row, adds 3 rows of overscan, and converts that to an item index range `[start, end)`.
5. Only those items are rendered, absolutely positioned with `transform: translate(...)`, which avoids layout work.

Cost per scroll frame depends on visible rows, not on folder size. The stats bar shows the live number of cells in the DOM (typically 50–100 regardless of folder size).

**Object URL lifecycle:** `PhotoCell` creates an object URL (`useObjectUrl`) when it mounts and revokes it on unmount. Memory use is bounded by what is on screen; scrolling away frees the blob URLs. The viewer does the same for the full-size image.

## Code structure

```
src/
  App.jsx                  state: scan report, open photo, rendered count
  utils/files.js           file filtering, sorting, size formatting (pure)
  hooks/
    useElementSize.js      ResizeObserver wrapper
    useVirtualGrid.js      virtualization math
    useObjectUrl.js        create/revoke object URLs
  components/
    FolderPicker.jsx       <input webkitdirectory>
    EmptyState.jsx         initial / empty / no-supported-files / loading messages
    StatsBar.jsx           counts + live DOM count
    VirtualGrid.jsx        renders the visible slice
    PhotoCell.jsx          one thumbnail
    Viewer.jsx             modal viewer, arrow-key nav, metadata
```

## Extras

- Live count of cells in the DOM
- Object URL cleanup
- Nested folders (flattened, with relative paths)
- Sort (name, date, size) and filter by name/folder. The grid and viewer share one derived list, so arrow-key navigation follows the current sort and filter.

## Edge cases handled

- Empty folder and folders with no supported images get specific messages (with a count of skipped file types).
- Non-image files and hidden files (`.DS_Store`) are skipped and counted.
- Extension and MIME type are both checked; corrupt images show an error in the viewer, and just stay blank as thumbnails.
- Re-selecting the same folder works; selecting a new folder resets the viewer.
- Nested folders are included (browsers return all files recursively); the relative path is shown in the viewer, and files are sorted by path with natural numeric ordering.

## Performance notes

- Rendering thousands of `<img>` elements at once freezes the page; virtualization fixed this.
- Setting state on every scroll event caused extra renders, so scroll updates are coalesced with `requestAnimationFrame`.
- `PhotoCell` is `memo`-ized and receives stable props, so rows already on screen don't re-render while scrolling.
- Listing 20k files with `webkitdirectory` is the slowest step (browser-side), so a loading state is shown.

## Limitations

- Thumbnails decode the original file. For folders of very large (e.g. 20 MP+) photos, fast scrolling can be slower than with pre-generated thumbnails. A next step would be `createImageBitmap` with resize in a Web Worker plus an LRU cache.
- Uniform square grid only (no masonry), and nested folders are flattened rather than shown as a tree.
- `webkitdirectory` shows a browser permission prompt ("upload" wording) even though nothing leaves the device.
- HEIC and RAW files aren't supported by most browsers and are skipped.
