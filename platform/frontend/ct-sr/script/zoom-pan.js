import { doms } from './doms.js'

window._ctsr.zoom = 1

export function updateZoom(zoom) {
  window._ctsr.zoom = zoom
  doms.currentZoomRate.innerHTML = String(Number(zoom).toFixed(2))
}

/**
 * 启用缩放功能
 */
function enableZooming() {
  const zoomStep = 0.25
  doms.zoomIn.addEventListener('click', () => {
    if (window._ctsr.zoom >= 5) {
      return
    }
    const viewport = cornerstone.getViewport(doms.root)
    viewport.scale += zoomStep
    updateZoom(viewport.scale)
    cornerstone.setViewport(doms.root, viewport)
  })
  doms.zoomOut.addEventListener('click', () => {
    if (window._ctsr.zoom <= zoomStep) {
      return
    }
    const viewport = cornerstone.getViewport(doms.root)
    viewport.scale -= zoomStep
    updateZoom(viewport.scale)
    cornerstone.setViewport(doms.root, viewport)
  })
}

/**
 * 启用拖拽功能
 */
function enablePanning() {
  doms.root.addEventListener('mousedown', function (e) {
    let lastX = e.pageX
    let lastY = e.pageY

    function mouseMoveHandler(e) {
      const deltaX = e.pageX - lastX
      const deltaY = e.pageY - lastY
      lastX = e.pageX
      lastY = e.pageY

      const viewport = cornerstone.getViewport(doms.root)
      viewport.translation.x += deltaX / viewport.scale
      viewport.translation.y += deltaY / viewport.scale
      cornerstone.setViewport(doms.root, viewport)
    }

    function mouseUpHandler() {
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  })
}

enableZooming()
enablePanning()
