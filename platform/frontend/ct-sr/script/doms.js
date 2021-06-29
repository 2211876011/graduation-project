const $ = document.getElementById.bind(document)

export const doms = {
  root: $('image-display'),
  wwInput: $('ww-input'),
  wlInput: $('wl-input'),
  applyWWWL: $('apply-btn'),
  invertImage: $('invert-btn'),
  resetImage: $('reset-btn'),
  presetWWWL: $('presetWWWL'),
  zoomIn: $('zoomIn-btn'),
  zoomOut: $('zoomOut-btn'),
  openDicom: $('openDicom'),
  currentZoomRate: $('current-zoom-rate'),
  remoteIP: $('remote-ip'),
  remoteStatus: $('remote-status'),
  srBtn: $('sr-btn'),
  srLoading: $('sr-loading'),
  srDone: $('sr-done'),
  srReplace: $('sr-replace')
}
