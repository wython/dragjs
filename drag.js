/**
 * 拖拽封装
 * Created by WYTHON on 2017/11/20.
 */

const DRAG_TYPE_LIST = ['x', 'y', 'all'];

import {getReTop, getReLeft, getStyle, getEle} from './position';


/**
 * 移动的元素选中时触发
 * @param e
 */
function onMouseDown(e) {
  e.preventDefault();
  this.flat = true;
  this.currentX = e.clientX;  //鼠标位置
  this.currentY = e.clientY;

  this.downFn.forEach((fn) => {
    fn && fn(e);
  })
}


/**
 * 移动元素完毕之后触发
 * @param e
 */
function onMouseUp(e) {
  if(!this.flat) return;
  this.flat = false;
  this.currentLeft = this.getLeft();
  this.currentTop = this.getTop();

  this.upFn.forEach((fn) => {
    fn && fn(e);
  })
}

/**
 * 鼠标移动时触发
 * @param e
 * @return {boolean}
 */
function onMouseMoving(e) {

  if (!this.flat) return false;
  let nowX = e.clientX;
  let nowY = e.clientY;
  let disX = nowX - this.currentX;
  let disY = nowY - this.currentY;

  //window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
  switch (this.dragType) {
    case 'x':
      //保持y轴不变
      this.setPosition(this.currentLeft + disX, parseInt(this.currentTop));
      break;
    case 'y':
      //保持x轴不变
      this.setPosition(parseInt(this.currentLeft), parseInt(this.currentTop) + disY)
      break;
    default :
      this.setPosition(parseInt(this.currentLeft) + disX, parseInt(this.currentTop) + disY);
      break;
  }

  this.movingFn.forEach((fn) => {
    fn(e)
  })
}


/**
 * opt = {
 *   targetType: 'all',  //x: 只沿着拖拽，y：只沿着y运动。'all'：正常拖动
 *   fixed: false,       //是否固定在页面
 *   top: null,          //初始位置
 *   left: null,
 *   container: ele|string
 * }
 *
 *
 * @param target
 * @param opt
 * @return {this}
 * @constructor
 */
export default function Drag(target, opt) {
  opt = Object.assign({
    dragType: 'all'
  }, opt);
  target = getEle(target);
  if (!(DRAG_TYPE_LIST.indexOf(opt.dragType) > -1)) throw new Error("DragType option must be one of 'x', 'y' or 'all'");
  if(getStyle(target, 'position') === 'fixed') opt.fixed = true;

  opt.container && (this.container = this.addContainer(opt.container));
  this.dragType = opt.dragType;
  this.target = typeof target === 'string' ? document.getElementById(target) : target;
  this.flat = false;

  this.target.style.cursor = 'move';
  this.opt = opt;

  this.downFn = [];   //移动前挂载函数
  this.upFn = [];     //移动后挂载函数
  this.movingFn = []; //移动时挂载函数

  return this;
};

Drag.prototype.addContainer = function (ele) {
  this.container = getEle(ele);
  return this;
};

Drag.prototype.initPosition = function () {
  if (this.opt.fixed) {
    //是否固定在页面
    this.container.style.position = 'fixed';
    this.currentTop = this.opt.top || this.getEleTop();
    this.currentLeft = this.opt.left || this.getEleLeft();
  } else {
    //不固定，需要计算父级定位元素
    this.container.style.position = 'absolute';
    this.currentTop = this.container.offsetTop;
    this.currentLeft = this.container.offsetLeft;
  }
  this.setPosition(this.currentLeft, this.currentTop);
};

Drag.prototype.on = function (eventType, cb) {
  //event type: down, move, up

  //扩展事件写法
  const mouseupList = ['onmouseup', 'mouseup', 'onMouseUp', 'mouseUp', 'moved'];
  const mousedownList = ['onmousedown', 'mousedown', 'onMouseDown', 'mouseDown', 'beforeMove'];
  const mousemoveList = ['onmousemove', 'mousemove', 'onMouseMove', 'mouseMove', 'moving'];

  if(mouseupList.indexOf(eventType) > -1) {
    this.upFn.push(cb);
    return this;
  }
  if(mousedownList.indexOf(eventType) > -1) {
    this.downFn.push(cb);
    return this;
  }
  if(mousemoveList.indexOf(eventType) > -1) {
    this.movingFn.push(cb);
    return this;
  }
  return this;
};

Drag.prototype.getTop = function () {
  return this.opt.fixed ? this.getEleTop() : this.container.offsetTop;
};

Drag.prototype.getLeft = function () {
  return this.opt.fixed ? this.getEleLeft() : this.container.offsetLeft
};


Drag.prototype.start = function () {
  if(!this.container) this.container = this.target;

  this.initPosition();

  this.target.addEventListener('mousedown', onMouseDown.bind(this));
  document.body.addEventListener('mousemove', onMouseMoving.bind(this));
  document.body.addEventListener('mouseup', onMouseUp.bind(this));

  return this;
};


Drag.prototype.setPosition = function (x, y) {
  this.container.style.top = y + 'px';
  this.container.style.left = x + 'px';
  return this;
};


Drag.prototype.getEleTop = function () {
  return getReTop(this.container)
};


Drag.prototype.getEleLeft = function () {
  return getReLeft(this.container)
};

