<template>
  <div class="canvas-home">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script>
// import '@/utils/fabric.min.js';
export default {
  name: 'CanvasHome',
  mounted() {
    this.$nextTick(() => {
      this.loadScript(
        {
          id: 'fabric',
          url: '/fabric.min.js',
        },
        this.loadCanvas,
      );
    });
  },
  methods: {
    loadScript(obj, cb) {
      if (document.getElementById(obj.id)) {
        cb();
      } else {
        const script = document.createElement('script');
        script.async = true;
        script.src = obj.url;
        script.id = obj.id;
        script.onload = () => {
          cb();
        };
        document.body.appendChild(script);
      }
    },
    loadCanvas() {
      const canvas = this.$refs['canvas'];
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      // this.$refs.canvas.openCanvas(canvas);
      // console.log(window.fabric);
      var fc = new window.fabric.Canvas(canvas);
      fc.isDrawingMode = true;
      // 创建一个矩形对象
      var rect = new window.fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        height: 20,
      });

      // 将矩形添加到canvas画布上
      fc.add(rect);
    },
  },
};
</script>
<style lang="scss" scoped>
.canvas-home {
  width: 100%;
  height: 100%;
  position: relative;
  .canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
