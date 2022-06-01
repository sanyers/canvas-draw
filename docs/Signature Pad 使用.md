# Signature Pad 使用

## git 地址

[https://github.com/szimek/signature_pad](https://github.com/szimek/signature_pad)

## 参数说明

- dotSize：点的大小（在屏幕上点击留下的点大小，单位：px）
- minWidth： 线的最小宽度（单位：px，默认：0.5）
- maxWidth：线的最大宽度（单位：px，默认：2.5）
- throttle：节流（每次绘制两个点之间的时间，单位：ms，默认：16，注意：设置过大会显得很卡顿）
- minDistance：最小距离（每次绘制两个点之间的最小距离，单位：px，默认：5）
- backgroundColor：背景色（默认：#000）
- penColor：线条颜色（默认：#fff）
- velocityFilterWeight：根据速度控制线的weight（默认：0.7）
- onBegin：一笔开始时触发的事件
- onEnd：一笔结束时触发的事件

## API说明

- toDataURL()：保存为图片，默认保存为png，toDataURL("image/jpeg")-保存为jpg，toDataURL("image/svg+xml")-保存为svg
- isEmpty()：签名是否为空
- clear()：清空签名
- toData()：返回签名点的数组
- fromData()：
- off()：解绑所有事件
- on()：重新绑定所有事件