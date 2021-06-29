import { doms } from './doms'
import { buildImageInfo, updateImageInfo } from './info'

window._ctsr.fileOpened = false

doms.openDicom.addEventListener('change', e => {
  const file = e.target.files[0]
  if (!file) {
    return
  }
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file)
  loadAndViewDicom(imageId, file.name)
  window._ctsr.fileOpened = true
  window._ctsr.srKey = void 0
  doms.srBtn.disabled = void 0
  doms.srLoading.style.display = 'none'
  doms.srDone.style.display = 'none'
})

function loadAndViewDicom(imageId, filename) {
  const element = doms.root
  cornerstone.loadImage(imageId).then(
    image => {
      const viewport = cornerstone.getDefaultViewportForImage(element, image)
      cornerstone.displayImage(element, image, viewport)
      doms.resetImage.click()
      function getTransferSyntax() {
        const value = image.data.string('x00020010')
        return value + ' [' + window._dicomTransferUids[value] + ']'
      }
      updateImageInfo(
        buildImageInfo(
          filename,
          'DICOM',
          image.data.uint16('x00280011'),
          image.data.uint16('x00280010'),
          getTransferSyntax()
        )
      )
      window._ctsr.imageHW = [image.data.uint16('x00280011'), image.data.uint16('x00280010')]
    },
    err => {
      alert(String(err))
      console.err(err)
    }
  )
}
