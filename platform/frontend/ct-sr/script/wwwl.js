import { doms } from './doms'

export const DefaultWWWL = [256, 128]

export function initWWWLDisplay() {
  doms.wwInput.value = DefaultWWWL[0]
  doms.wlInput.value = DefaultWWWL[1]
}

doms.applyWWWL.addEventListener('click', () => {
  setWWWL(+doms.wwInput.value, +doms.wlInput.value)
  doms.presetWWWL.selectedIndex = -1
})

/**
 * 调整窗宽窗位
 */
function setWWWL(ww, wl) {
  const viewport = cornerstone.getViewport(doms.root)
  viewport.voi.windowWidth = ww
  viewport.voi.windowCenter = wl
  cornerstone.setViewport(doms.root, viewport)
}

const CommonWWWLs = [
  {
    name: '脑组织',
    wwwl: [90, 35]
  },
  {
    name: '胸部-纵膈',
    wwwl: [400, 40]
  },
  {
    name: '胸部-肺',
    wwwl: [1500, -700]
  },
  {
    name: '腹部-肝脾',
    wwwl: [150, 37]
  },
  {
    name: '腹部-肾',
    wwwl: [250, 30]
  },
  {
    name: '脊椎旁软组织',
    wwwl: [275, 40]
  },
  {
    name: '骨',
    wwwl: [1400, 375]
  }
]

/**
 * 加载预设窗
 */
CommonWWWLs.forEach((v, i) => {
  const optionEl = document.createElement('option')
  optionEl.value = i
  optionEl.innerHTML = v.name
  document.getElementById('presetWWWL').appendChild(optionEl)
})
doms.presetWWWL.selectedIndex = -1
doms.presetWWWL.addEventListener('change', () => {
  const record = CommonWWWLs[doms.presetWWWL.selectedIndex]
  doms.wwInput.value = record.wwwl[0]
  doms.wlInput.value = record.wwwl[1]
  setWWWL(...record.wwwl)
})
