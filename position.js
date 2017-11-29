/**
 *
 *
 * Created by wython on 2017/11/22.
 */


/**
 * check element
 * 判断ele
 * @param ele
 * @return {*}
 */
export function getEle(ele) {
  if (typeof ele === 'string') ele = document.getElementById(ele);
  if (!ele) throw new Error('参数Ele不是合法的DOM元素');
  return ele;
}


/**
 * get element style by js
 * 通过js获取元素样式
 *
 * @param ele
 * @param key
 * @return {*}
 */
export function getStyle(ele, key) {
  ele = getEle(ele);
  if (ele.style && ele.style[key]) return ele.style.backgroundColor;
  let eleStyle = window.getComputedStyle ? window.getComputedStyle(ele) : ele.currentStyle;
  return eleStyle ? eleStyle[key] : false;
}


/**
 *
 * get Element background color, first, get the style inline,
 * and then, get thought computed style
 * 获取元素的背景颜色，先获取行内元素，在获取计算样式
 *
 * @param ele {DomElement|String}
 * @return {String|Boolean}
 */
export function getBg(ele) {
  return getStyle(ele, 'backgroundColor')
}


/**
 *
 * computed the element view port
 * 获取页面可视区域大小
 * @return {{width: number, height: number}}
 */
export function getViewPort() {
  if (document.compatMode == "BackCompat") {
    //ie6文档模式下
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    }
  } else {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  }
}


/**
 *
 * @param ele
 * @param position{String} 'top' | 'left'
 */
function getDistance(ele, position) {
  ele = getEle(ele);
  position = position.replace(position.charAt(0), position.charAt(0).toUpperCase());

  let distanceKey = 'offset' +position;
  let current = ele.offsetParent;

  let distance = getEle(ele)[distanceKey];
  while (current) {
    distance += current[distanceKey];
    current = current.offsetParent;
  }

  return distance;
}

/**
 * 获取绝对left
 * @param ele
 * @return {*}
 */
function getAbLeft(ele) {
  return getDistance(ele, 'Left')
}

/**
 * 获取绝对height
 * @param ele
 * @return {*}
 */
function getAbTop(ele) {
  return getDistance(ele, 'Top')
}

/**
 *
 * 获取元素绝对值坐标
 *
 * @param ele
 * @return {{top: *, left: *}}
 */
export function absolutePosition(ele) {
  let quick = this.getBoundingClientRect();

  return {
    top: quick ? quick.top : getAbTop(ele),
    left:quick ? quick.left : getAbLeft(ele)
  }
}


export function getReTop(ele) {
  if(document.compatMode == 'BackCompat') {
    return getAbTop(ele) - document.body.scrollTop;
  } else {
    return getAbTop(ele) - document.documentElement.scrollTop;
  }
}

export function getReLeft(ele) {
  if(document.compatMode == 'BackCompat') {
    return getAbLeft(ele) - document.body.scrollLeft;
  } else {
    return getAbLeft(ele) - document.documentElement.scrollLeft;
  }
}

/**
 * 获取元素可视化区域位置
 *
 * @param ele
 * @return {{left: *, top: *}}
 */
export function getViewPosition(ele) {
  return {
    left: getReLeft(ele),
    top: getReTop(ele)
  }
}



