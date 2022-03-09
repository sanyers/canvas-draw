// cdn 服务
const cdn = {
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
  },
};

// 打包路径
const publicPath =
  process.env.NODE_ENV === 'production' ? '/canvas-draw/' : '/';

// gzip包
const CompressionWebpackPlugin = require('compression-webpack-plugin');
//匹配此 {RegExp} 的资源
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
  publicPath,
  outputDir: 'dist',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'canvas画板、白板',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      chunksSortMode: 'manual',
    },
  },
  productionSourceMap: false,
  configureWebpack: {
    // 开启cdn通过外部引用
    externals: process.env.NODE_ENV === 'production' ? cdn.externals : {},
    // 开启gzip
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(productionGzipExtensions),
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
  },
  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1,
};
