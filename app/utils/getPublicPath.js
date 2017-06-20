/**
 * Dynamically get public path for loading chunks and other assets
 */
export default function getPublicPath() {
  if (window.__simplechart_public_path__) { // eslint-disable-line no-underscore-dangle
    return window.__simplechart_public_path__; // eslint-disable-line no-underscore-dangle
  }
  return '/static/';
}
