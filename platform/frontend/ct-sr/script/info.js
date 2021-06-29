export function buildImageInfo(filename, type, h, w, transfer) {
  return {
    filename,
    type,
    h,
    w,
    transfer
  }
}

export function updateImageInfo(imageInfo) {
  Object.keys(imageInfo).forEach(v => {
    v && (document.getElementById('info-' + v).innerText = String(imageInfo[v]))
  })
}
