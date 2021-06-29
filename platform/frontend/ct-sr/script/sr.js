import { BackendUrl } from './config'
import { doms } from './doms'
import { updateImageInfo } from './info'

window._ctsr.remoteAvailable = false

function updateRemote(callback) {
  fetch(BackendUrl + 'ping', { method: 'get', mode: 'cors' })
    .then(resp => {
      resp
        .json()
        .then(json => {
          window._ctsr.remoteAvailable = json && json.success
          callback && callback()
        })
        .catch(reason => {
          throw reason
        })
    })
    .catch(reason => {
      console.log('[remote err] ' + String(reason))
      window._ctsr.remoteAvailable = false
    })
    .finally(() => {
      doms.remoteStatus.innerText = window._ctsr.remoteAvailable ? '运行中' : '正尝试连接'
      doms.remoteStatus.style.fontWeight = 700
      doms.remoteStatus.style.color = window._ctsr.remoteAvailable ? '#228B22' : 'red'
    })
}

export function initRemote() {
  doms.remoteIP.innerText = BackendUrl
  updateRemote()
  window._ctsr._heartbeat = window.setInterval(() => {
    updateRemote()
  }, 10 * 1000 /* check per 10sec */)
}

function resetImageExceptWWWL() {
  const viewport = cornerstone.getViewport(doms.root)
  const ww = viewport.voi.windowWidth
  const wl = viewport.voi.windowCenter
  const presetWWWL = doms.presetWWWL.value
  doms.resetImage.click()
  viewport.voi.windowWidth = ww
  viewport.voi.windowCenter = wl
  cornerstone.setViewport(doms.root, viewport)
  doms.presetWWWL.value = presetWWWL
  doms.wwInput.value = ww
  doms.wlInput.value = wl
}

async function srCurrentImage() {
  resetImageExceptWWWL()
  const canvas = document.querySelector('.cornerstone-canvas')
  function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(',')[1])
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    let ab = new ArrayBuffer(byteString.length)
    let ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    let blob = new Blob([ab], { type: mimeString })
    return blob
  }
  const imageBlob = dataURItoBlob(canvas.toDataURL('image/bmp', 1.0))
  return new Promise((resolve, reject) => {
    if (!window._ctsr.remoteAvailable) {
      reject('remote not available')
    }
    let formData = new FormData()
    formData.append('image', imageBlob, 'image')
    fetch(BackendUrl + 'predict', {
      method: 'post',
      mode: 'cors',
      body: formData
    })
      .then(resp => {
        resp.json().then(resolve, reject)
      })
      .catch(reject)
  })
}

function handleSRRequest() {
  updateRemote(() => {
    if (!window._ctsr.fileOpened) {
      alert('当前没有文件打开！')
      return
    }
    if (!window._ctsr.remoteAvailable) {
      alert('远程推理服务不可用！')
      return
    }
    doms.srBtn.disabled = 'true'
    doms.srLoading.style.display = 'inline-block'
    srCurrentImage()
      .then(res => {
        doms.srLoading.style.display = 'none'

        window._ctsr.srKey = res['filename']
        doms.srDone.style.display = 'inline-block'
      })
      .catch(alert)
  })
}

doms.srBtn.addEventListener('click', handleSRRequest)

function handleSRReplace() {
  if (!window._ctsr.srKey) {
    alert('没有服务器返回的超分辨率图片可提取！')
    return
  }
  const srUrl = BackendUrl + `get_output?filename=${window._ctsr.srKey}`
  loadAndViewWebImage(srUrl, () => {
    updateImageInfo({
      type: 'SR',
      h: window._ctsr.imageHW[0] * 4,
      w: window._ctsr.imageHW[1] * 4,
      transfer: ''
    })
    doms.zoomOut.click()
    doms.zoomIn.click()
  })
}

function loadAndViewWebImage(url, callback) {
  cornerstone.loadImage(url).then(image => {
    const viewport = cornerstone.getDefaultViewportForImage(doms.root, image)
    cornerstone.displayImage(doms.root, image, viewport)
    callback && callback()
  })
}

doms.srReplace.addEventListener('click', handleSRReplace)
