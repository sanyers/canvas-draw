/**
 * canvas 画板
 */
export class Palette {
  constructor(
    canvas,
    {
      drawType = 'line', // 绘制类型
      drawColor = 'rgba(19, 206, 102, 1)', // 绘制颜色
      lineWidth = 5, // 线条宽度
      sides = 3, // 多边形边数
      fillStyle = null, // 初始填充颜色
      allowCallback, // 允许操作的回调
      moveCallback, // 鼠标移动的回调
    },
  ) {
    this.canvas = canvas; // 画板DOM
    this.width = canvas.width; // 宽
    this.height = canvas.height; // 高
    this.ratio =
      canvas.width > canvas.clientWidth ? canvas.width / canvas.clientWidth : 1; // 比例(width和clientWidth不一致可调整比例)
    this.ctx = canvas.getContext('2d');

    this.isClickCanvas = false; // 是否点击canvas内部
    this.isMoveCanvas = false; // 鼠标是否有移动
    this.imgData = []; // 存储上一次的图像，用于撤回
    this.index = 0; // 记录当前显示的是第几帧
    this.x = 0; // 鼠标按下时的 x 坐标
    this.y = 0; // 鼠标按下时的 y 坐标
    this.last = [this.x, this.y]; // 鼠标按下及每次移动后的坐标
    this.drawType = drawType; // 绘制形状
    this.drawColor = drawColor; // 绘制颜色
    this.lineWidth = lineWidth; // 线条宽度
    this.sides = sides; // 多边形边数
    this.fillStyle = fillStyle; // 初始填充颜色
    this.allowCallback = allowCallback || function () {}; // 允许操作的回调
    this.moveCallback = moveCallback || function () {}; // 鼠标移动的回调
    this.bindMousemove = function () {}; // 解决 eventlistener 不能bind
    this.bindMousedown = function () {}; // 解决 eventlistener 不能bind
    this.bindMouseup = function () {}; // 解决 eventlistener 不能bind
    this.init();
  }
  init() {
    if (this.fillStyle) {
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
    this.gatherImage();
    this.bindMousemove = this.onmousemove.bind(this); // 解决 eventlistener 不能bind
    this.bindMousedown = this.onmousedown.bind(this);
    this.bindMouseup = this.onmouseup.bind(this);
    let eventNameDown = 'mousedown',
      eventNameUp = 'mouseup';
    if ('ontouchstart' in this.canvas) {
      // 移动端适配
      this.isTouch = true;
      eventNameDown = 'touchstart';
      eventNameUp = 'touchend';
    } else {
      // PC 端鼠标事件
      this.isTouch = false;
    }
    this.canvas.addEventListener(eventNameDown, this.bindMousedown);
    this.canvas.addEventListener(eventNameUp, this.bindMouseup);
  }
  // 获取当前位置
  getPoint(e) {
    const { pageX, pageY, target } = e.changedTouches[0];
    const { top, left } = target.getBoundingClientRect(); // 获取当前节点到视口顶部和左边的距离
    const x = (pageX - left) * this.ratio;
    const y = (pageY - top) * this.ratio;
    return { x, y };
  }
  // 鼠标按下
  onmousedown(e) {
    e.preventDefault();
    let eventName = 'mousemove';
    if (this.isTouch) {
      const { x, y } = this.getPoint(e);
      e.offsetX = x;
      e.offsetY = y;
      eventName = 'touchmove';
    }
    this.canvas.addEventListener(eventName, this.bindMousemove);
    this.isClickCanvas = true;
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.last = [this.x, this.y];
  }
  gatherImage() {
    // 采集图像
    this.imgData = this.imgData.slice(0, this.index + 1); // 每次鼠标抬起时，将储存的imgdata截取至index处
    let imgData = this.ctx.getImageData(0, 0, this.width, this.height);
    this.imgData.push(imgData);
    this.index = this.imgData.length - 1; // 储存完后将 index 重置为 imgData 最后一位
    this.allowCallback(this.index > 0, this.index < this.imgData.length - 1);
  }
  reSetImage() {
    // 重置为上一帧
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.imgData.length >= 1) {
      this.ctx.putImageData(this.imgData[this.index], 0, 0);
    }
  }
  // 鼠标移动
  onmousemove(e) {
    if (this.isTouch) {
      e.preventDefault();
      const { x, y } = this.getPoint(e);
      e.offsetX = x;
      e.offsetY = y;
    }
    this.isMoveCanvas = true;
    let endx = e.offsetX;
    let endy = e.offsetY;
    let width = endx - this.x;
    let height = endy - this.y;
    let now = [endx, endy]; // 当前移动到的位置
    switch (this.drawType) {
      case 'pencil':
        {
          let params = [this.last, now, this.lineWidth, this.drawColor, true];
          this.moveCallback('pencil', ...params);
          this.line(...params);
        }
        break;
      case 'line':
        {
          let params = [this.last, now, this.lineWidth, this.drawColor];
          this.moveCallback('line', ...params);
          this.line(...params);
        }
        break;
      case 'rect':
        {
          let params = [
            this.x,
            this.y,
            width,
            height,
            this.lineWidth,
            this.drawColor,
          ];
          this.moveCallback('rect', ...params);
          this.rect(...params);
        }
        break;
      case 'polygon':
        {
          let params = [
            this.x,
            this.y,
            this.sides,
            width,
            height,
            this.lineWidth,
            this.drawColor,
          ];
          this.moveCallback('polygon', ...params);
          this.polygon(...params);
        }
        break;
      case 'arc':
        {
          let params = [
            this.x,
            this.y,
            width,
            height,
            this.lineWidth,
            this.drawColor,
          ];
          this.moveCallback('arc', ...params);
          this.arc(...params);
        }
        break;
      case 'eraser':
        {
          let params = [endx, endy, this.lineWidth];
          this.moveCallback('eraser', ...params);
          this.eraser(...params);
        }
        break;
    }
  }
  // 鼠标抬起
  onmouseup(e) {
    e.preventDefault();
    if (this.isClickCanvas) {
      this.isClickCanvas = false;
      if (this.isTouch) {
        this.canvas.removeEventListener('touchmove', this.bindMousemove);
      } else {
        this.canvas.removeEventListener('mousemove', this.bindMousemove);
      }
      if (this.isMoveCanvas) {
        // 鼠标没有移动不保存
        this.isMoveCanvas = false;
        this.gatherImage();
        this.moveCallback('gatherImage', this.index);
      }
    }
  }
  // 绘制线性（直线和铅笔）
  line(last, now, lineWidth, drawColor, isPencil) {
    if (!isPencil) {
      this.reSetImage();
    }
    this.ctx.beginPath();
    this.ctx.lineCap = 'round'; // 设定线条与线条间接合处的样式
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = drawColor;
    this.ctx.moveTo(last[0], last[1]);
    this.ctx.lineTo(now[0], now[1]);
    this.ctx.closePath();
    this.ctx.stroke(); // 进行绘制
    if (isPencil) {
      // 铅笔需要保存最后一次记录
      this.last = now;
    }
  }
  // 绘制矩形
  rect(x, y, width, height, lineWidth, drawColor) {
    this.reSetImage();
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = drawColor;
    this.ctx.strokeRect(x, y, width, height);
  }
  // 绘制多边形
  polygon(x, y, sides, width, height, lineWidth, drawColor) {
    this.reSetImage();
    let n = sides;
    let ran = 360 / n;
    let rn = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    this.ctx.beginPath();
    this.ctx.strokeStyle = drawColor;
    this.ctx.lineWidth = lineWidth;
    for (let i = 0; i < n; i++) {
      this.ctx.lineTo(
        x + Math.sin(((i * ran + 45) * Math.PI) / 180) * rn,
        y + Math.cos(((i * ran + 45) * Math.PI) / 180) * rn,
      );
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }
  // 绘制圆形
  arc(x, y, width, height, lineWidth, drawColor) {
    this.reSetImage();
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
    let r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
    this.ctx.strokeStyle = drawColor;
    this.ctx.closePath();
    this.ctx.stroke();
  }
  // 橡皮擦
  eraser(endx, endy, lineWidth) {
    this.ctx.save();
    this.line(this.last, [endx, endy], lineWidth * 2, '#fff', true);
  }
  // 撤回
  cancel() {
    if (--this.index < 0) {
      this.index = 0;
      return;
    }
    this.allowCallback(this.index > 0, this.index < this.imgData.length - 1);
    this.ctx.putImageData(this.imgData[this.index], 0, 0);
  }
  // 前进
  go() {
    if (++this.index > this.imgData.length - 1) {
      this.index = this.imgData.length - 1;
      return;
    }
    this.allowCallback(this.index > 0, this.index < this.imgData.length - 1);
    this.ctx.putImageData(this.imgData[this.index], 0, 0);
  }
  // 清屏
  clear() {
    this.imgData = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.gatherImage();
  }
  // 设置画板参数
  changeWay({ type, color, lineWidth, sides }) {
    if (type === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out'; // 擦除
    } else {
      this.ctx.globalCompositeOperation = 'source-over'; // 画
    }
    // 绘制条件
    this.drawType = (type !== 'color' && type) || this.drawType; // 绘制形状
    this.drawColor = color || this.drawColor; // 绘制颜色
    this.lineWidth = lineWidth || this.lineWidth; // 线宽
    this.sides = sides || this.sides; // 边数
  }
  // 获取当前画面数据
  getImageDataNow() {
    return this.imgData[this.index];
  }
  // 销毁画板
  destroy() {
    this.clear();
    this.canvas.removeEventListener('mousedown', this.bindMousedown);
    this.canvas.removeEventListener('mouseup', this.bindMouseup);
    this.canvas = null;
    this.ctx = null;
  }
}
