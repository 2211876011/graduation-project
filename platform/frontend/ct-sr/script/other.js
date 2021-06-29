import { doms } from './doms.js'
import { initWWWLDisplay } from './wwwl.js'
import { updateZoom } from './zoom-pan.js';

doms.invertImage.addEventListener('click', () => {
  const viewport = cornerstone.getViewport(doms.root)
  viewport.invert = !viewport.invert
  cornerstone.setViewport(doms.root, viewport)
})

doms.resetImage.addEventListener('click', () => {
  doms.presetWWWL.selectedIndex = -1
  initWWWLDisplay()
  updateZoom(1)
  cornerstone.reset(doms.root)
})
