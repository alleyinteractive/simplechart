/**
 * Dynamically get public path for loading chunks and other assets
 */
export default function getPublicPath() {
  if (window.__simplechart_public_path__) {
    return window.__simplechart_public_path__;
  }
  return '/static/';
}
