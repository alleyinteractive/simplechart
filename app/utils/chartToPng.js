/* eslint-disable no-param-reassign */
/**
 * Convert chart to PNG data string
 */

function svgToString(svgEl) {
  const copyEl = svgEl.cloneNode(true);
  const defs = document.createElement('defs');
  const appliedStyles = 'path.nv-line { fill:none; }';
  const style = document.createElement('style');
  const cdata = document.createTextNode(appliedStyles);

  copyEl.insertBefore(defs, copyEl.firstChild);
  style.setAttribute('type', 'text/css');
  style.appendChild(cdata);
  defs.appendChild(style);

  return new XMLSerializer().serializeToString(copyEl);
}

export default function renderPreviewImage(chartEl, canvasEl, previewEl) {
  // Set up elements and svg
  const svgString = svgToString(chartEl.getElementsByTagName('svg')[0]);
  const ctx = canvasEl.getContext('2d');
  const DOMURL = self.URL || self.webkitURL || self;
  const img = new Image();
  const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = DOMURL.createObjectURL(svg);

  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    const png = canvasEl.toDataURL('image/png');
    previewEl.src = png;
    DOMURL.revokeObjectURL(png);
  };
  img.src = url;
}
