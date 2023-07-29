<template>
  <div ref="chartEl" style="height:100%"></div>
</template>
<script>
import echarts from '@/utils/echarts-config.js'
export default {
  name: 'ChartBlock',
  data() {
    return {
      chart: null,
      objectRef: null,
    }
  },
  watch: {
    option: {
      handler(newValue, oldValue) {
        this.chart.setOption(newValue)
      },
      // 因为option是个对象，而我们对于echarts的配置项，要更改的数据往往不在一级属性里面
      // 所以这里设置了deep:true，vue文档有说明
      deep: true
    }
  },
  mounted() {
    // 获取到window对象,监听hhy-container宽度发生变化执行绘制
    this.objectRef = document.getElementsByClassName('objectRef')[0].contentDocument.defaultView;




    this.chart = echarts.init(this.$refs.chartEl)

    // 添加窗口改变监听,增加节流，每隔200ms执行
    this.chart._resize = this.throttle(() => {
      this.chart.resize()
    }, 500)

    // window.addEventListener('resize', this.chart._resize)

    this.objectRef.addEventListener("resize", this.chart._resize);
  },
  methods: {
    // 去除props,添加methods
    setOption(option) {
      // 切断折线图监听
      this.chart.on('magictypechanged', function (params) {
        if (params.currentType == 'line') {
          this && this.setOption({
            xAxis: {
              boundaryGap: true,
            }
          })
        }
      });
      this.chart && this.chart.setOption(option)
    },
    // 节流
    throttle(func, wait, options) {
      let time, context, args
      let previous = 0
      if (!options) options = {}

      const later = function () {
        previous = options.leading === false ? 0 : new Date().getTime()
        time = null
        func.apply(context, args)
        if (!time) context = args = null
      }

      const throttled = function () {
        const now = new Date().getTime()
        if (!previous && options.leading === false) previous = now
        const remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
          if (time) {
            clearTimeout(time)
            time = null
          }
          previous = now
          func.apply(context, args)
          if (!time) context = args = null
        } else if (!time && options.trailing !== false) {
          time = setTimeout(later, remaining)
        }
      }
      return throttled
    }
  },
  beforeDestroy() {
    // 移除窗口改变监听
    this.objectRef.removeEventListener('resize', this.chart._resize)
  }
}
</script>
