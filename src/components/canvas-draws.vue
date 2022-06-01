<template>
  <div class="canvas-draw">
    <div class="canvas-tools">
      <i
        v-for="item in drawControl"
        :key="item.type"
        :class="itemClassList(item)"
        :title="item.title"
        @click="onDrawControl(item)"></i>
      <el-input-number
        class="canvas-number"
        size="mini"
        v-model="drawConfig.dotSize"
        controls-position="right"
        @change="lineWidthChange"
        :min="1"
        :max="10"></el-input-number>
      <input
        type="color"
        title="颜色"
        :value="drawConfig.penColor"
        @change="onColor" />
      <i
        class="canvas-iconfont icon-cv-baocun"
        title="保存"
        @click="onSave"></i>
      <i
        class="canvas-iconfont icon-cv-upload"
        title="上传"
        @click="onUpload"></i>
      <i class="canvas-iconfont icon-cv-down" title="下载" @click="onDown"></i>
      <i
        class="canvas-iconfont icon-cv-guanbi"
        title="关闭"
        @click="onClose"></i>
    </div>
  </div>
</template>
<script>
import PalettePad from '@/utils/signature_pad';
export default {
  name: 'CanvasDraws',
  computed: {
    itemClassList() {
      const _this = this;
      return function (item) {
        return `canvas-iconfont ${item.icon} ${
          item.type === _this.drawConfig.drawType ? 'active' : ''
        }`;
      };
    },
  },
  data() {
    return {
      // 画板工具
      drawControl: [
        { title: '铅笔', type: 'pencil', icon: 'icon-cv-pencil', category: 1 },
        {
          title: '铅笔2',
          type: 'pencil2',
          icon: 'icon-cv-pencil',
          category: 1,
        },
        {
          title: '线条',
          type: 'line',
          icon: 'icon-cv-line',
          category: 1,
        },
        {
          title: '圆',
          type: 'arc',
          icon: 'icon-cv-tuoyuan',
          category: 1,
        },
        { title: '矩形', type: 'rect', icon: 'icon-cv-checkbox', category: 1 },
        {
          title: '橡皮擦',
          type: 'eraser',
          icon: 'icon-cv-xiangpica',
          category: 1,
        },
        { title: '撤回', type: 'cancel', icon: 'icon-cv-undo', category: 2 },
        { title: '前进', type: 'go', icon: 'icon-cv-redo', category: 2 },
        { title: '清屏', type: 'clear', icon: 'icon-cv-shanchu', category: 2 },
      ],
      // 画板配置
      drawConfig: {
        dotSize: 1, // 线宽
        backgroundColor: 'rgba(0, 0, 0, 1)', // 背景
        penColor: '#ffffff', // 线条颜色
        drawType: 'pencil', // 工具类型
      },
      // 画板实例
      palette: null,
    };
  },
  methods: {
    // 打开画板
    openCanvas(drawCanvas) {
      if (!this.palette) {
        this.palette = new PalettePad(drawCanvas, this.drawConfig);
        this.lineWidthChange();
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        drawCanvas.width = drawCanvas.offsetWidth * ratio;
        drawCanvas.height = drawCanvas.offsetHeight * ratio;
        drawCanvas.getContext('2d').scale(ratio, ratio);
        this.palette.clear();
        this.palette.addEventListener('beginStroke', () => {
          this.palette.cancelHistory = [];
        });
      }
    },
    // 关闭画板
    closeCanvas() {
      this.palette.clear();
      this.palette.off();
      this.palette = null;
    },
    // 修改线宽
    lineWidthChange() {
      const { dotSize } = this.drawConfig;
      this.palette.dotSize = dotSize;
      if (this.palette.drawType === 'pencil2') {
        this.palette.minWidth = dotSize;
        this.palette.maxWidth = dotSize;
      } else {
        this.palette.minWidth = dotSize * 0.1;
        this.palette.maxWidth = dotSize * 1.9;
      }
    },
    // 修改颜色
    onColor(val) {
      this.palette.penColor = val.target.value;
    },
    // 绘制动作
    onDrawControl(item) {
      switch (item.category) {
        case 1:
          this.drawConfig.drawType = item.type;
          this.palette.drawType = item.type;
          if (item.type === 'eraser') {
            this.palette.penColor = '#000000';
            this.palette.eraser(18);
          } else if (item.type === 'pencil2') {
            this.palette.eraser(this.drawConfig.dotSize);
          } else {
            this.palette.draw();
          }
          break;
        case 2:
          this.palette[item.type]();
          break;
        case 3:
          break;
        default:
          break;
      }
    },
    // 关闭
    onClose() {
      this.$emit('on-close');
    },
    // 保存
    onSave() {
      const nowData = this.palette.getImageDataNow();
      this.$emit('on-save', nowData);
    },
    // 上传
    onUpload() {
      this.$emit('on-upload');
    },
    // 下载
    onDown() {
      this.$emit('on-down');
    },
  },
};
</script>
<style lang="scss" scoped>
.canvas-draw {
  position: absolute;
  bottom: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  .canvas-tools {
    width: 650px;
    text-align: center;
    padding: 12px 0;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    color: #dfdfdf;
    display: flex;
    justify-content: center;
    align-items: center;
    .canvas-number {
      width: 70px;
      margin: 0 12px;
      ::v-deep .el-input__inner {
        padding-left: 0;
        padding-right: 30px;
      }
    }
    .canvas-iconfont {
      font-size: 24px;
      margin-left: 12px;
    }
    .canvas-iconfont:active {
      color: #fff;
    }
    .active {
      color: #fff;
    }
  }
}
</style>
