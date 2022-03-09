<template>
  <div class="home">
    <canvas ref="canvas" class="canvas"></canvas>
    <!-- 画板工具 -->
    <canvas-draw
      v-if="isCanvas"
      ref="canvasDrawRef"
      @on-close="closeCanvas"
      @on-save="saveCanvas"
      @on-upload="uploadCanvas"
      @on-down="downCanvas"></canvas-draw>
  </div>
</template>

<script>
import CanvasDraw from '@/components/canvas-draw.vue';
export default {
  name: 'Home',
  components: {
    CanvasDraw,
  },
  data() {
    return {
      isCanvas: true,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const canvas = this.$refs['canvas'];
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      this.$refs.canvasDrawRef.openCanvas(canvas);
    });
  },
  methods: {
    closeCanvas() {
      alert('关闭画板');
    },
    // 保存画板
    saveCanvas(imageData) {
      console.log(imageData);
    },
    // 上传画板
    uploadCanvas() {
      const canvas = this.$refs['canvas'];
      const fileName = `draw-${new Date().getTime()}.png`;
      canvas.toBlob(blob => {
        const params = new FormData();
        params.append('testId', '111');
        params.append('file', blob, fileName);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/test', true);
        xhr.send(params);
      });
    },
    // 下载画板
    downCanvas() {
      const canvas = this.$refs['canvas'];
      const fileName = `draw-${new Date().getTime()}.png`;
      const base64 = canvas.toDataURL();
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = base64;
      link.setAttribute('download', fileName); // 文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // 下载完成移除元素
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  .canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
