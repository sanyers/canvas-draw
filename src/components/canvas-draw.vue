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
        v-model="lineWidth"
        controls-position="right"
        @change="lineWidthChange"
        :min="1"
        :max="10"></el-input-number>
      <input type="color" title="颜色" :value="color" @change="onColor" />
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
import { Palette } from '@/utils/palette';
export default {
  name: 'CanvasDraw',
  computed: {
    itemClassList() {
      const _this = this;
      return function (item) {
        return `canvas-iconfont ${item.icon} ${
          item.type === _this.curryControl ? 'active' : ''
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
      // 当前工具类型
      curryControl: 'pencil',
      // 线条颜色
      color: '#000000',
      // 线条宽度
      lineWidth: 5,
      allowCancel: true,
      allowGo: true,
      // 画板实例
      palette: null,
    };
  },
  methods: {
    // 打开画板
    openCanvas(drawCanvas) {
      if (!this.palette) {
        this.palette = new Palette(drawCanvas, {
          drawColor: this.color,
          drawType: this.curryControl,
          lineWidth: this.lineWidth,
          fillStyle: true, // 初始背景色，若为空则透明背景
          // allowCallback: this.allowCallback,
          // moveCallback: this.moveCallback,
        });
      }
    },
    // 关闭画板
    closeCanvas() {
      this.palette.destroy();
      this.palette = null;
    },
    // 修改线宽
    lineWidthChange() {
      this.palette.changeWay({ lineWidth: this.lineWidth });
    },
    // 修改颜色
    onColor(val) {
      this.color = val.target.value;
      this.palette.changeWay({ color: this.color });
    },
    // 绘制动作
    onDrawControl(item) {
      switch (item.category) {
        case 1:
          this.curryControl = item.type;
          this.palette.changeWay({
            type: this.curryControl,
          });
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
    width: 600px;
    text-align: center;
    padding: 12px 0;
    background-color: rgba(0, 0, 0, 0.4);
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
