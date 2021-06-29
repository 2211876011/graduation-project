import { doms } from './doms.js'
import { BaseUrl } from './config.js'

const defaultImageId = BaseUrl + 'assets/default.png'
function loadDefaultImage() {
  cornerstone.loadImage(defaultImageId).then(image => {
    cornerstone.displayImage(doms.root, image)
  })
}
loadDefaultImage()
