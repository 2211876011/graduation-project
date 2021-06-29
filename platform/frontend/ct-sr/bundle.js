/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ct-sr/script/config.js":
/*!********************************!*\
  !*** ./ct-sr/script/config.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BaseUrl\": () => (/* binding */ BaseUrl),\n/* harmony export */   \"BackendUrl\": () => (/* binding */ BackendUrl)\n/* harmony export */ });\nconst BaseUrl = 'http://localhost:5500/ct-sr/';\nconst BackendUrl = 'http://223.3.73.3:9090/';\n\n//# sourceURL=webpack://frontend/./ct-sr/script/config.js?");

/***/ }),

/***/ "./ct-sr/script/default.js":
/*!*********************************!*\
  !*** ./ct-sr/script/default.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _doms_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./doms.js */ \"./ct-sr/script/doms.js\");\n/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.js */ \"./ct-sr/script/config.js\");\n\n\nconst defaultImageId = _config_js__WEBPACK_IMPORTED_MODULE_1__.BaseUrl + 'assets/default.png';\n\nfunction loadDefaultImage() {\n  cornerstone.loadImage(defaultImageId).then(image => {\n    cornerstone.displayImage(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root, image);\n  });\n}\n\nloadDefaultImage();\n\n//# sourceURL=webpack://frontend/./ct-sr/script/default.js?");

/***/ }),

/***/ "./ct-sr/script/doms.js":
/*!******************************!*\
  !*** ./ct-sr/script/doms.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"doms\": () => (/* binding */ doms)\n/* harmony export */ });\nconst $ = document.getElementById.bind(document);\nconst doms = {\n  root: $('image-display'),\n  wwInput: $('ww-input'),\n  wlInput: $('wl-input'),\n  applyWWWL: $('apply-btn'),\n  invertImage: $('invert-btn'),\n  resetImage: $('reset-btn'),\n  presetWWWL: $('presetWWWL'),\n  zoomIn: $('zoomIn-btn'),\n  zoomOut: $('zoomOut-btn'),\n  openDicom: $('openDicom'),\n  currentZoomRate: $('current-zoom-rate'),\n  remoteIP: $('remote-ip'),\n  remoteStatus: $('remote-status'),\n  srBtn: $('sr-btn'),\n  srLoading: $('sr-loading'),\n  srDone: $('sr-done'),\n  srReplace: $('sr-replace')\n};\n\n//# sourceURL=webpack://frontend/./ct-sr/script/doms.js?");

/***/ }),

/***/ "./ct-sr/script/file.js":
/*!******************************!*\
  !*** ./ct-sr/script/file.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _doms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./doms */ \"./ct-sr/script/doms.js\");\n/* harmony import */ var _info__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./info */ \"./ct-sr/script/info.js\");\n\n\nwindow._ctsr.fileOpened = false;\n_doms__WEBPACK_IMPORTED_MODULE_0__.doms.openDicom.addEventListener('change', e => {\n  const file = e.target.files[0];\n\n  if (!file) {\n    return;\n  }\n\n  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);\n  loadAndViewDicom(imageId, file.name);\n  window._ctsr.fileOpened = true;\n  window._ctsr.srKey = void 0;\n  _doms__WEBPACK_IMPORTED_MODULE_0__.doms.srBtn.disabled = void 0;\n  _doms__WEBPACK_IMPORTED_MODULE_0__.doms.srLoading.style.display = 'none';\n  _doms__WEBPACK_IMPORTED_MODULE_0__.doms.srDone.style.display = 'none';\n});\n\nfunction loadAndViewDicom(imageId, filename) {\n  const element = _doms__WEBPACK_IMPORTED_MODULE_0__.doms.root;\n  cornerstone.loadImage(imageId).then(image => {\n    const viewport = cornerstone.getDefaultViewportForImage(element, image);\n    cornerstone.displayImage(element, image, viewport);\n    _doms__WEBPACK_IMPORTED_MODULE_0__.doms.resetImage.click();\n\n    function getTransferSyntax() {\n      const value = image.data.string('x00020010');\n      return value + ' [' + window._dicomTransferUids[value] + ']';\n    }\n\n    (0,_info__WEBPACK_IMPORTED_MODULE_1__.updateImageInfo)((0,_info__WEBPACK_IMPORTED_MODULE_1__.buildImageInfo)(filename, 'DICOM', image.data.uint16('x00280011'), image.data.uint16('x00280010'), getTransferSyntax()));\n    window._ctsr.imageHW = [image.data.uint16('x00280011'), image.data.uint16('x00280010')];\n  }, err => {\n    alert(String(err));\n    console.err(err);\n  });\n}\n\n//# sourceURL=webpack://frontend/./ct-sr/script/file.js?");

/***/ }),

/***/ "./ct-sr/script/index.js":
/*!*******************************!*\
  !*** ./ct-sr/script/index.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lib_style_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/style.less */ \"./ct-sr/lib/style.less\");\n/* harmony import */ var _init_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./init.js */ \"./ct-sr/script/init.js\");\n/* harmony import */ var _default_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./default.js */ \"./ct-sr/script/default.js\");\n/* harmony import */ var _file_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./file.js */ \"./ct-sr/script/file.js\");\n/* harmony import */ var _info_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./info.js */ \"./ct-sr/script/info.js\");\n/* harmony import */ var _other_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./other.js */ \"./ct-sr/script/other.js\");\n/* harmony import */ var _sr_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sr.js */ \"./ct-sr/script/sr.js\");\n/* harmony import */ var _wwwl_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./wwwl.js */ \"./ct-sr/script/wwwl.js\");\n/* harmony import */ var _zoom_pan_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./zoom-pan.js */ \"./ct-sr/script/zoom-pan.js\");\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://frontend/./ct-sr/script/index.js?");

/***/ }),

/***/ "./ct-sr/script/info.js":
/*!******************************!*\
  !*** ./ct-sr/script/info.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"buildImageInfo\": () => (/* binding */ buildImageInfo),\n/* harmony export */   \"updateImageInfo\": () => (/* binding */ updateImageInfo)\n/* harmony export */ });\nfunction buildImageInfo(filename, type, h, w, transfer) {\n  return {\n    filename,\n    type,\n    h,\n    w,\n    transfer\n  };\n}\nfunction updateImageInfo(imageInfo) {\n  Object.keys(imageInfo).forEach(v => {\n    v && (document.getElementById('info-' + v).innerText = String(imageInfo[v]));\n  });\n}\n\n//# sourceURL=webpack://frontend/./ct-sr/script/info.js?");

/***/ }),

/***/ "./ct-sr/script/init.js":
/*!******************************!*\
  !*** ./ct-sr/script/init.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _doms_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./doms.js */ \"./ct-sr/script/doms.js\");\n/* harmony import */ var _sr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sr.js */ \"./ct-sr/script/sr.js\");\n/* harmony import */ var _wwwl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wwwl.js */ \"./ct-sr/script/wwwl.js\");\n\n\n\n\nfunction initCornerstone() {\n  cornerstoneWebImageLoader.external.cornerstone = cornerstone;\n  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;\n  cornerstone.enable(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root);\n  cornerstoneWADOImageLoader.configure({\n    useWebWorkers: true\n  });\n}\n\ninitCornerstone();\n(0,_wwwl_js__WEBPACK_IMPORTED_MODULE_2__.initWWWLDisplay)();\n(0,_sr_js__WEBPACK_IMPORTED_MODULE_1__.initRemote)();\n\n//# sourceURL=webpack://frontend/./ct-sr/script/init.js?");

/***/ }),

/***/ "./ct-sr/script/other.js":
/*!*******************************!*\
  !*** ./ct-sr/script/other.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _doms_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./doms.js */ \"./ct-sr/script/doms.js\");\n/* harmony import */ var _wwwl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wwwl.js */ \"./ct-sr/script/wwwl.js\");\n/* harmony import */ var _zoom_pan_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./zoom-pan.js */ \"./ct-sr/script/zoom-pan.js\");\n\n\n\n_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.invertImage.addEventListener('click', () => {\n  const viewport = cornerstone.getViewport(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root);\n  viewport.invert = !viewport.invert;\n  cornerstone.setViewport(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root, viewport);\n});\n_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.resetImage.addEventListener('click', () => {\n  _doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.presetWWWL.selectedIndex = -1;\n  (0,_wwwl_js__WEBPACK_IMPORTED_MODULE_1__.initWWWLDisplay)();\n  (0,_zoom_pan_js__WEBPACK_IMPORTED_MODULE_2__.updateZoom)(1);\n  cornerstone.reset(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root);\n});\n\n//# sourceURL=webpack://frontend/./ct-sr/script/other.js?");

/***/ }),

/***/ "./ct-sr/script/sr.js":
/*!****************************!*\
  !*** ./ct-sr/script/sr.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initRemote\": () => (/* binding */ initRemote)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./ct-sr/script/config.js\");\n/* harmony import */ var _doms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./doms */ \"./ct-sr/script/doms.js\");\n/* harmony import */ var _info__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./info */ \"./ct-sr/script/info.js\");\n\n\n\nwindow._ctsr.remoteAvailable = false;\n\nfunction updateRemote(callback) {\n  fetch(_config__WEBPACK_IMPORTED_MODULE_0__.BackendUrl + 'ping', {\n    method: 'get',\n    mode: 'cors'\n  }).then(resp => {\n    resp.json().then(json => {\n      window._ctsr.remoteAvailable = json && json.success;\n      callback && callback();\n    }).catch(reason => {\n      throw reason;\n    });\n  }).catch(reason => {\n    console.log('[remote err] ' + String(reason));\n    window._ctsr.remoteAvailable = false;\n  }).finally(() => {\n    _doms__WEBPACK_IMPORTED_MODULE_1__.doms.remoteStatus.innerText = window._ctsr.remoteAvailable ? '运行中' : '正尝试连接';\n    _doms__WEBPACK_IMPORTED_MODULE_1__.doms.remoteStatus.style.fontWeight = 700;\n    _doms__WEBPACK_IMPORTED_MODULE_1__.doms.remoteStatus.style.color = window._ctsr.remoteAvailable ? '#228B22' : 'red';\n  });\n}\n\nfunction initRemote() {\n  _doms__WEBPACK_IMPORTED_MODULE_1__.doms.remoteIP.innerText = _config__WEBPACK_IMPORTED_MODULE_0__.BackendUrl;\n  updateRemote();\n  window._ctsr._heartbeat = window.setInterval(() => {\n    updateRemote();\n  }, 10 * 1000\n  /* check per 10sec */\n  );\n}\n\nfunction resetImageExceptWWWL() {\n  const viewport = cornerstone.getViewport(_doms__WEBPACK_IMPORTED_MODULE_1__.doms.root);\n  const ww = viewport.voi.windowWidth;\n  const wl = viewport.voi.windowCenter;\n  const presetWWWL = _doms__WEBPACK_IMPORTED_MODULE_1__.doms.presetWWWL.value;\n  _doms__WEBPACK_IMPORTED_MODULE_1__.doms.resetImage.click();\n  viewport.voi.windowWidth = ww;\n  viewport.voi.windowCenter = wl;\n  cornerstone.setViewport(_doms__WEBPACK_IMPORTED_MODULE_1__.doms.root, viewport);\n  _doms__WEBPACK_IMPORTED_MODULE_1__.doms.presetWWWL.value = presetWWWL;\n  _doms__WEBPACK_IMPORTED_MODULE_1__.doms.wwInput.value = ww;\n  _doms__WEBPACK_IMPORTED_MODULE_1__.doms.wlInput.value = wl;\n}\n\nasync function srCurrentImage() {\n  resetImageExceptWWWL();\n  const canvas = document.querySelector('.cornerstone-canvas');\n\n  function dataURItoBlob(dataURI) {\n    let byteString = atob(dataURI.split(',')[1]);\n    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];\n    let ab = new ArrayBuffer(byteString.length);\n    let ia = new Uint8Array(ab);\n\n    for (let i = 0; i < byteString.length; i++) {\n      ia[i] = byteString.charCodeAt(i);\n    }\n\n    let blob = new Blob([ab], {\n      type: mimeString\n    });\n    return blob;\n  }\n\n  const imageBlob = dataURItoBlob(canvas.toDataURL('image/bmp', 1.0));\n  return new Promise((resolve, reject) => {\n    if (!window._ctsr.remoteAvailable) {\n      reject('remote not available');\n    }\n\n    let formData = new FormData();\n    formData.append('image', imageBlob, 'image');\n    fetch(_config__WEBPACK_IMPORTED_MODULE_0__.BackendUrl + 'predict', {\n      method: 'post',\n      mode: 'cors',\n      body: formData\n    }).then(resp => {\n      resp.json().then(resolve, reject);\n    }).catch(reject);\n  });\n}\n\nfunction handleSRRequest() {\n  updateRemote(() => {\n    if (!window._ctsr.fileOpened) {\n      alert('当前没有文件打开！');\n      return;\n    }\n\n    if (!window._ctsr.remoteAvailable) {\n      alert('远程推理服务不可用！');\n      return;\n    }\n\n    _doms__WEBPACK_IMPORTED_MODULE_1__.doms.srBtn.disabled = 'true';\n    _doms__WEBPACK_IMPORTED_MODULE_1__.doms.srLoading.style.display = 'inline-block';\n    srCurrentImage().then(res => {\n      _doms__WEBPACK_IMPORTED_MODULE_1__.doms.srLoading.style.display = 'none';\n      window._ctsr.srKey = res['filename'];\n      _doms__WEBPACK_IMPORTED_MODULE_1__.doms.srDone.style.display = 'inline-block';\n    }).catch(alert);\n  });\n}\n\n_doms__WEBPACK_IMPORTED_MODULE_1__.doms.srBtn.addEventListener('click', handleSRRequest);\n\nfunction handleSRReplace() {\n  if (!window._ctsr.srKey) {\n    alert('没有服务器返回的超分辨率图片可提取！');\n    return;\n  }\n\n  const srUrl = _config__WEBPACK_IMPORTED_MODULE_0__.BackendUrl + `get_output?filename=${window._ctsr.srKey}`;\n  loadAndViewWebImage(srUrl, () => {\n    (0,_info__WEBPACK_IMPORTED_MODULE_2__.updateImageInfo)({\n      type: 'SR',\n      h: window._ctsr.imageHW[0] * 4,\n      w: window._ctsr.imageHW[1] * 4,\n      transfer: ''\n    });\n    _doms__WEBPACK_IMPORTED_MODULE_1__.doms.zoomOut.click();\n    _doms__WEBPACK_IMPORTED_MODULE_1__.doms.zoomIn.click();\n  });\n}\n\nfunction loadAndViewWebImage(url, callback) {\n  cornerstone.loadImage(url).then(image => {\n    const viewport = cornerstone.getDefaultViewportForImage(_doms__WEBPACK_IMPORTED_MODULE_1__.doms.root, image);\n    cornerstone.displayImage(_doms__WEBPACK_IMPORTED_MODULE_1__.doms.root, image, viewport);\n    callback && callback();\n  });\n}\n\n_doms__WEBPACK_IMPORTED_MODULE_1__.doms.srReplace.addEventListener('click', handleSRReplace);\n\n//# sourceURL=webpack://frontend/./ct-sr/script/sr.js?");

/***/ }),

/***/ "./ct-sr/script/wwwl.js":
/*!******************************!*\
  !*** ./ct-sr/script/wwwl.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DefaultWWWL\": () => (/* binding */ DefaultWWWL),\n/* harmony export */   \"initWWWLDisplay\": () => (/* binding */ initWWWLDisplay)\n/* harmony export */ });\n/* harmony import */ var _doms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./doms */ \"./ct-sr/script/doms.js\");\n\nconst DefaultWWWL = [256, 128];\nfunction initWWWLDisplay() {\n  _doms__WEBPACK_IMPORTED_MODULE_0__.doms.wwInput.value = DefaultWWWL[0];\n  _doms__WEBPACK_IMPORTED_MODULE_0__.doms.wlInput.value = DefaultWWWL[1];\n}\n_doms__WEBPACK_IMPORTED_MODULE_0__.doms.applyWWWL.addEventListener('click', () => {\n  setWWWL(+_doms__WEBPACK_IMPORTED_MODULE_0__.doms.wwInput.value, +_doms__WEBPACK_IMPORTED_MODULE_0__.doms.wlInput.value);\n  _doms__WEBPACK_IMPORTED_MODULE_0__.doms.presetWWWL.selectedIndex = -1;\n});\n/**\r\n * 调整窗宽窗位\r\n */\n\nfunction setWWWL(ww, wl) {\n  const viewport = cornerstone.getViewport(_doms__WEBPACK_IMPORTED_MODULE_0__.doms.root);\n  viewport.voi.windowWidth = ww;\n  viewport.voi.windowCenter = wl;\n  cornerstone.setViewport(_doms__WEBPACK_IMPORTED_MODULE_0__.doms.root, viewport);\n}\n\nconst CommonWWWLs = [{\n  name: '脑组织',\n  wwwl: [90, 35]\n}, {\n  name: '胸部-纵膈',\n  wwwl: [400, 40]\n}, {\n  name: '胸部-肺',\n  wwwl: [1500, -700]\n}, {\n  name: '腹部-肝脾',\n  wwwl: [150, 37]\n}, {\n  name: '腹部-肾',\n  wwwl: [250, 30]\n}, {\n  name: '脊椎旁软组织',\n  wwwl: [275, 40]\n}, {\n  name: '骨',\n  wwwl: [1400, 375]\n}];\n/**\r\n * 加载预设窗\r\n */\n\nCommonWWWLs.forEach((v, i) => {\n  const optionEl = document.createElement('option');\n  optionEl.value = i;\n  optionEl.innerHTML = v.name;\n  document.getElementById('presetWWWL').appendChild(optionEl);\n});\n_doms__WEBPACK_IMPORTED_MODULE_0__.doms.presetWWWL.selectedIndex = -1;\n_doms__WEBPACK_IMPORTED_MODULE_0__.doms.presetWWWL.addEventListener('change', () => {\n  const record = CommonWWWLs[_doms__WEBPACK_IMPORTED_MODULE_0__.doms.presetWWWL.selectedIndex];\n  _doms__WEBPACK_IMPORTED_MODULE_0__.doms.wwInput.value = record.wwwl[0];\n  _doms__WEBPACK_IMPORTED_MODULE_0__.doms.wlInput.value = record.wwwl[1];\n  setWWWL(...record.wwwl);\n});\n\n//# sourceURL=webpack://frontend/./ct-sr/script/wwwl.js?");

/***/ }),

/***/ "./ct-sr/script/zoom-pan.js":
/*!**********************************!*\
  !*** ./ct-sr/script/zoom-pan.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"updateZoom\": () => (/* binding */ updateZoom)\n/* harmony export */ });\n/* harmony import */ var _doms_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./doms.js */ \"./ct-sr/script/doms.js\");\n\nwindow._ctsr.zoom = 1;\nfunction updateZoom(zoom) {\n  window._ctsr.zoom = zoom;\n  _doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.currentZoomRate.innerHTML = String(Number(zoom).toFixed(2));\n}\n/**\r\n * 启用缩放功能\r\n */\n\nfunction enableZooming() {\n  const zoomStep = 0.25;\n  _doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.zoomIn.addEventListener('click', () => {\n    if (window._ctsr.zoom >= 5) {\n      return;\n    }\n\n    const viewport = cornerstone.getViewport(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root);\n    viewport.scale += zoomStep;\n    updateZoom(viewport.scale);\n    cornerstone.setViewport(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root, viewport);\n  });\n  _doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.zoomOut.addEventListener('click', () => {\n    if (window._ctsr.zoom <= zoomStep) {\n      return;\n    }\n\n    const viewport = cornerstone.getViewport(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root);\n    viewport.scale -= zoomStep;\n    updateZoom(viewport.scale);\n    cornerstone.setViewport(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root, viewport);\n  });\n}\n/**\r\n * 启用拖拽功能\r\n */\n\n\nfunction enablePanning() {\n  _doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root.addEventListener('mousedown', function (e) {\n    let lastX = e.pageX;\n    let lastY = e.pageY;\n\n    function mouseMoveHandler(e) {\n      const deltaX = e.pageX - lastX;\n      const deltaY = e.pageY - lastY;\n      lastX = e.pageX;\n      lastY = e.pageY;\n      const viewport = cornerstone.getViewport(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root);\n      viewport.translation.x += deltaX / viewport.scale;\n      viewport.translation.y += deltaY / viewport.scale;\n      cornerstone.setViewport(_doms_js__WEBPACK_IMPORTED_MODULE_0__.doms.root, viewport);\n    }\n\n    function mouseUpHandler() {\n      document.removeEventListener('mousemove', mouseMoveHandler);\n      document.removeEventListener('mouseup', mouseUpHandler);\n    }\n\n    document.addEventListener('mousemove', mouseMoveHandler);\n    document.addEventListener('mouseup', mouseUpHandler);\n  });\n}\n\nenableZooming();\nenablePanning();\n\n//# sourceURL=webpack://frontend/./ct-sr/script/zoom-pan.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./ct-sr/lib/style.less":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./ct-sr/lib/style.less ***!
  \***********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);\n// Imports\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, \"* {\\n  margin: 0;\\n  padding: 0;\\n  box-sizing: border-box;\\n}\\n.banner {\\n  width: 100%;\\n  background-color: #4bc6ff;\\n  color: white;\\n  padding: 10px 20px;\\n  margin-bottom: 10px;\\n}\\n.btn {\\n  padding: 2px 8px;\\n  background-color: #fff;\\n  font-size: 1rem;\\n  margin-right: 4px;\\n}\\n.btn img {\\n  height: 1.25rem;\\n  margin-right: 6px;\\n}\\n.container {\\n  display: flex;\\n}\\n.container .left {\\n  margin: 10px;\\n  margin-right: 30px;\\n}\\n.container .right {\\n  padding: 1rem;\\n  margin-right: 1rem;\\n  background-color: #efefef;\\n  flex: 1;\\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\\n}\\n.container .right .right-title {\\n  font-size: 1.5rem;\\n  font-weight: bold;\\n}\\n.container .right #remote-display {\\n  color: green;\\n  font-weight: bold;\\n}\\n.container .right #ww-input,\\n.container .right #wl-input {\\n  font-size: 1rem;\\n  width: 4rem;\\n}\\n.container .right #presetWWWL {\\n  font-size: 1rem;\\n}\\n.container .right #info-display {\\n  list-style: none;\\n  text-indent: 1rem;\\n  line-height: 1.5rem;\\n}\\n.container .right #sr-area {\\n  margin-left: 8px;\\n  display: inline-block;\\n  border: 1px dotted black;\\n  padding: 5px;\\n}\\n.container .right #sr-area #sr-loading {\\n  display: none;\\n}\\n.container .right #sr-area #sr-loading img {\\n  width: 24px;\\n  height: auto;\\n}\\n.container .right #sr-done {\\n  margin-left: 8px;\\n  display: none;\\n}\\n.container .right #sr-done span {\\n  color: #02af02;\\n}\\n.section {\\n  border: 1px solid gray;\\n  margin: 10px;\\n  padding: 8px;\\n}\\n\", \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://frontend/./ct-sr/lib/style.less?./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\n// eslint-disable-next-line func-names\nmodule.exports = function (cssWithMappingToString) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = cssWithMappingToString(item);\n\n      if (item[2]) {\n        return \"@media \".concat(item[2], \" {\").concat(content, \"}\");\n      }\n\n      return content;\n    }).join(\"\");\n  }; // import a list of modules into the list\n  // eslint-disable-next-line func-names\n\n\n  list.i = function (modules, mediaQuery, dedupe) {\n    if (typeof modules === \"string\") {\n      // eslint-disable-next-line no-param-reassign\n      modules = [[null, modules, \"\"]];\n    }\n\n    var alreadyImportedModules = {};\n\n    if (dedupe) {\n      for (var i = 0; i < this.length; i++) {\n        // eslint-disable-next-line prefer-destructuring\n        var id = this[i][0];\n\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n\n    for (var _i = 0; _i < modules.length; _i++) {\n      var item = [].concat(modules[_i]);\n\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        // eslint-disable-next-line no-continue\n        continue;\n      }\n\n      if (mediaQuery) {\n        if (!item[2]) {\n          item[2] = mediaQuery;\n        } else {\n          item[2] = \"\".concat(mediaQuery, \" and \").concat(item[2]);\n        }\n      }\n\n      list.push(item);\n    }\n  };\n\n  return list;\n};\n\n//# sourceURL=webpack://frontend/./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./ct-sr/lib/style.less":
/*!******************************!*\
  !*** ./ct-sr/lib/style.less ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_style_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/less-loader/dist/cjs.js!./style.less */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./ct-sr/lib/style.less\");\n\n            \n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_style_less__WEBPACK_IMPORTED_MODULE_1__.default, options);\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_less_loader_dist_cjs_js_style_less__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});\n\n//# sourceURL=webpack://frontend/./ct-sr/lib/style.less?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar isOldIE = function isOldIE() {\n  var memo;\n  return function memorize() {\n    if (typeof memo === 'undefined') {\n      // Test for IE <= 9 as proposed by Browserhacks\n      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805\n      // Tests for existence of standard globals is to allow style-loader\n      // to operate correctly into non-standard environments\n      // @see https://github.com/webpack-contrib/style-loader/issues/177\n      memo = Boolean(window && document && document.all && !window.atob);\n    }\n\n    return memo;\n  };\n}();\n\nvar getTarget = function getTarget() {\n  var memo = {};\n  return function memorize(target) {\n    if (typeof memo[target] === 'undefined') {\n      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself\n\n      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n        try {\n          // This will throw an exception if access to iframe is blocked\n          // due to cross-origin restrictions\n          styleTarget = styleTarget.contentDocument.head;\n        } catch (e) {\n          // istanbul ignore next\n          styleTarget = null;\n        }\n      }\n\n      memo[target] = styleTarget;\n    }\n\n    return memo[target];\n  };\n}();\n\nvar stylesInDom = [];\n\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n\n  for (var i = 0; i < stylesInDom.length; i++) {\n    if (stylesInDom[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n\n  return result;\n}\n\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var index = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3]\n    };\n\n    if (index !== -1) {\n      stylesInDom[index].references++;\n      stylesInDom[index].updater(obj);\n    } else {\n      stylesInDom.push({\n        identifier: identifier,\n        updater: addStyle(obj, options),\n        references: 1\n      });\n    }\n\n    identifiers.push(identifier);\n  }\n\n  return identifiers;\n}\n\nfunction insertStyleElement(options) {\n  var style = document.createElement('style');\n  var attributes = options.attributes || {};\n\n  if (typeof attributes.nonce === 'undefined') {\n    var nonce =  true ? __webpack_require__.nc : 0;\n\n    if (nonce) {\n      attributes.nonce = nonce;\n    }\n  }\n\n  Object.keys(attributes).forEach(function (key) {\n    style.setAttribute(key, attributes[key]);\n  });\n\n  if (typeof options.insert === 'function') {\n    options.insert(style);\n  } else {\n    var target = getTarget(options.insert || 'head');\n\n    if (!target) {\n      throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n    }\n\n    target.appendChild(style);\n  }\n\n  return style;\n}\n\nfunction removeStyleElement(style) {\n  // istanbul ignore if\n  if (style.parentNode === null) {\n    return false;\n  }\n\n  style.parentNode.removeChild(style);\n}\n/* istanbul ignore next  */\n\n\nvar replaceText = function replaceText() {\n  var textStore = [];\n  return function replace(index, replacement) {\n    textStore[index] = replacement;\n    return textStore.filter(Boolean).join('\\n');\n  };\n}();\n\nfunction applyToSingletonTag(style, index, remove, obj) {\n  var css = remove ? '' : obj.media ? \"@media \".concat(obj.media, \" {\").concat(obj.css, \"}\") : obj.css; // For old IE\n\n  /* istanbul ignore if  */\n\n  if (style.styleSheet) {\n    style.styleSheet.cssText = replaceText(index, css);\n  } else {\n    var cssNode = document.createTextNode(css);\n    var childNodes = style.childNodes;\n\n    if (childNodes[index]) {\n      style.removeChild(childNodes[index]);\n    }\n\n    if (childNodes.length) {\n      style.insertBefore(cssNode, childNodes[index]);\n    } else {\n      style.appendChild(cssNode);\n    }\n  }\n}\n\nfunction applyToTag(style, options, obj) {\n  var css = obj.css;\n  var media = obj.media;\n  var sourceMap = obj.sourceMap;\n\n  if (media) {\n    style.setAttribute('media', media);\n  } else {\n    style.removeAttribute('media');\n  }\n\n  if (sourceMap && typeof btoa !== 'undefined') {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  } // For old IE\n\n  /* istanbul ignore if  */\n\n\n  if (style.styleSheet) {\n    style.styleSheet.cssText = css;\n  } else {\n    while (style.firstChild) {\n      style.removeChild(style.firstChild);\n    }\n\n    style.appendChild(document.createTextNode(css));\n  }\n}\n\nvar singleton = null;\nvar singletonCounter = 0;\n\nfunction addStyle(obj, options) {\n  var style;\n  var update;\n  var remove;\n\n  if (options.singleton) {\n    var styleIndex = singletonCounter++;\n    style = singleton || (singleton = insertStyleElement(options));\n    update = applyToSingletonTag.bind(null, style, styleIndex, false);\n    remove = applyToSingletonTag.bind(null, style, styleIndex, true);\n  } else {\n    style = insertStyleElement(options);\n    update = applyToTag.bind(null, style, options);\n\n    remove = function remove() {\n      removeStyleElement(style);\n    };\n  }\n\n  update(obj);\n  return function updateStyle(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {\n        return;\n      }\n\n      update(obj = newObj);\n    } else {\n      remove();\n    }\n  };\n}\n\nmodule.exports = function (list, options) {\n  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>\n  // tags it will allow on a page\n\n  if (!options.singleton && typeof options.singleton !== 'boolean') {\n    options.singleton = isOldIE();\n  }\n\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n\n    if (Object.prototype.toString.call(newList) !== '[object Array]') {\n      return;\n    }\n\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDom[index].references--;\n    }\n\n    var newLastIdentifiers = modulesToDom(newList, options);\n\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n\n      var _index = getIndexByIdentifier(_identifier);\n\n      if (stylesInDom[_index].references === 0) {\n        stylesInDom[_index].updater();\n\n        stylesInDom.splice(_index, 1);\n      }\n    }\n\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://frontend/./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./ct-sr/script/index.js");
/******/ 	
/******/ })()
;