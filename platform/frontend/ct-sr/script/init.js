import { doms } from './doms.js'
import { initRemote } from './sr.js';
import { initWWWLDisplay } from './wwwl.js'

function initCornerstone() {
  cornerstoneWebImageLoader.external.cornerstone = cornerstone
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone
  cornerstone.enable(doms.root)
  cornerstoneWADOImageLoader.configure({
    useWebWorkers: true
  })
}

initCornerstone()
initWWWLDisplay()
initRemote()
