<template>
  <div class="hhy-container">
    <!-- 用于监听hhy-containe宽度变化，重新绘制echarts -->
    <object class="objectRef" tabindex="-1" type="text/html" aria-hidden="true" data="about:blank">
    </object>

    <!-- 顶部卡片 -->
    <div class="card-wrap">
      <el-card class="card-item">
        <div class="card-detial">
          <p>订单数/成交额（日）（单/元）</p>
          <p>0/0</p>
          <p>日同比 0%</p>
          <el-tag class="tag" type="primary">日</el-tag>
        </div>
        <p class="card-bottom">昨日新增 0 单</p>
      </el-card>
      <el-card class="card-item">
        <div class="card-detial">
          <p>订单数/成交额（月）（单/元）</p>
          <p>16/190746.3</p>
          <p>月同比 -75.76% <i class="bottom"></i></p>
          <el-tag class="tag" type="success">月</el-tag>
        </div>
        <p class="card-bottom">上月新增 66 单</p>
      </el-card>
      <el-card class="card-item">
        <div class="card-detial">
          <p>订单数/成交额（年）（单/元）</p>
          <p>233/3779387.03</p>
          <p>年同比 3228.57% <i class="top"></i></p>
          <el-tag class="tag" type="warning">年</el-tag>
        </div>
        <p class="card-bottom">去年新增 7 单</p>
      </el-card>
    </div>

    <!-- 图表 -->
    <el-card class="echart">
      <el-form inline :model="searchForm">
        <el-form-item>
          <el-date-picker v-model="searchForm.date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>

    </el-card>

    <div class="echart-content">
      <div class="echart-item">
        <el-card>
          <div slot="header" class="head">
            <span>订单销售曲线图</span>
          </div>
          <div class="cont">
            <echarts ref="echarts1" />
          </div>
        </el-card>
      </div>
      <div class="echart-item">
        <el-card>
          <div slot="header" class="head">
            <span>渠道分析</span>
          </div>
          <div class="cont">
            <echarts ref="echarts2" />
          </div>
        </el-card>
      </div>
    </div>

    <div class="echart-content">
      <el-card class="echart-footItem">
        <div slot="header" class="head">
          <span>类目销售柱状图</span>
        </div>
        <div class="cont">
          <echarts ref="echarts3" />
        </div>
      </el-card>
      <el-card class="echart-footItem">
        <div slot="header" class="head">
          <span>预约转化率</span>
        </div>
        <div class="cont">
          <div class="zhl">
            <el-progress type="circle" :percentage="48"></el-progress>
            <p>总流量</p>
            <p>2</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import echarts from "@/components/echarts";
export default {
  name: 'DataCenter',
  components: { echarts },
  data() {
    return {
      searchForm: {
        date: "", // 开始日期结束日期
      },
      // 日期筛选
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  mounted() {
    this.initEcharts1();
    this.initEcharts2();
    this.initEcharts3();
    this.initEcharts4();
  },
  methods: {
    // 订单销售曲线图
    initEcharts1() {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          },
          top: 24,
          right: 50,
        },
        legend: {
          data: ['单量', '金额'],
          top: 30,
          left: 50,
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: ['2023-06-01', '2023-06-02', '2023-06-03', '2023-06-04', '2023-06-05']
        },
        yAxis: [{
          type: 'value',
          splitNumber: 5,
          axisLabel: {
            show: true,
            formatter: function (value, index) {
              return value + '单';
            },
          },
        },
        {
          type: 'value',
          alignTicks: true,
          axisLabel: {
            show: true,
            formatter: function (value, index) {
              return '￥' + value;
            },
          },
        }],
        grid: {
          top: 100,
          left: 50,
          right: 50,
          bottom: 15, //生成的图片和顶部的间距
          containLabel: true //为ture才会生效
        },
        series: [
          {
            name: '单量',
            yAxisIndex: 0,
            data: [10, 15, 11, 13, 40],
            type: 'line',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 单';
              }
            }
          },
          {
            name: '金额',
            yAxisIndex: 1,
            data: [1000, 800, 900, 680, 770],
            type: 'line',
            tooltip: {
              valueFormatter: function (value) {
                return '￥ ' + value;
              }
            }
          }
        ]
      };
      this.$refs.echarts1.setOption(option)
    },
    // 渠道分析
    initEcharts2() {
      let option = {
        title: [
          {
            text: '',
            left: 'center',
            textStyle: {
              fontSize: 24, //字体大小
              lineHeight: 24 //字体行高
            }
          },
          {
            subtext: '渠道收入',
            left: '25%',
            bottom: '-5%',
            textAlign: 'center',
            subtextStyle: {
              color: '#464646',
              fontSize: 16, //字体大小
              lineHeight: 45, //字体行高
              fontWeight: 'bolder'
            }
          },
          {
            subtext: '渠道客户',
            right: '15%',
            bottom: '-5%',
            textAlign: 'center',
            subtextStyle: {
              color: '#464646',
              fontSize: 16, //字体大小
              lineHeight: 45, //字体行高
              fontWeight: 'bolder'
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          top: '0%',
          left: '0%'
        },
        series: [
          {
            name: '渠道收入',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{d}%'
            },
            labelLine: {
              show: true,
              smooth: true
            },
            center: ['50%', '50%'],
            left: 0,
            right: '50%',
            top: 0,
            bottom: 0,
            data: [
              { value: 1048, name: '其他' },
              { value: 735, name: '美团' },
              { value: 580, name: '百度' },
              { value: 484, name: '快手' },
              { value: 300, name: '抖音' }
            ]
          },
          {
            name: '渠道客户',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{d}%'
            },
            labelLine: {
              show: true,
              smooth: true
            },
            center: ['50%', '50%'],
            right: 0,
            left: '50%',
            top: 0,
            bottom: 0,
            data: [
              { value: 848, name: '其他' },
              { value: 1999, name: '美团' },
              { value: 1000, name: '百度' },
              { value: 1184, name: '快手' },
              { value: 900, name: '抖音' }
            ]
          }
        ]
      };
      this.$refs.echarts2.setOption(option)
    },
    // 类目销售柱状图
    initEcharts3() {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          },
          top: 24,
          right: 50
        },
        legend: {
          data: ['订单数', '金额'],
          top: 30,
          left: 50
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: ['定制收入', '租赁收入', '成品收入']
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 5,
            axisLabel: {
              show: true,
              formatter: function (value, index) {
                return value + '单';
              }
            }
          },
          {
            type: 'value',
            alignTicks: true,
            axisLabel: {
              show: true,
              formatter: function (value, index) {
                return '￥' + value;
              }
            }
          }
        ],
        grid: {
          top: 100,
          left: 50,
          right: 50,
          bottom: 15, //生成的图片和顶部的间距
          containLabel: true //为ture才会生效
        },
        series: [
          {
            name: '订单数',
            yAxisIndex: 0,
            data: [10, 18, 15],
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return '￥ ' + value;
              }
            }
          },
          {
            name: '金额',
            yAxisIndex: 1,
            data: [8000, 12500, 10000],
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 单';
              }
            }
          }
        ]
      };
      this.$refs.echarts3.setOption(option)
    },
    // 预约转化率
    initEcharts4() {

    },



  }
}
</script>

<style lang="scss" scoped>
$hhy_gray_color: #b4afaf;
$hhy_primary_color: #409eff;

.objectRef {
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border: none;
  padding: 0px;
  margin: 0px;
  opacity: 0;
  z-index: -1000;
  pointer-events: none;
}
.el-card {
  overflow: auto;
}
.card-head {
  font-size: 16px;
}

.card {
  &-wrap {
    display: flex;
    gap: 0 15px;
    flex-wrap: wrap;
  }
  &-item {
    margin-top: 15px;
    flex: 1;
    min-width: 300px;
  }
  &-detial {
    position: relative;
    border-bottom: 1px solid #ebeef5;
    p {
      display: flex;
      align-items: center;
      &:nth-child(1) {
        color: $hhy_gray_color;
      }
      &:nth-child(2) {
        font-size: 22px;
        font-weight: 700;
      }
    }
    i.bottom {
      margin-left: 5px;
      width: 0;
      height: 0;
      border-top: 5px solid $hhy_primary_color;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
    }
    i.top {
      margin-left: 5px;
      width: 0;
      height: 0;
      border-bottom: 5px solid red;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
    }
    .tag {
      position: absolute;
      right: 0;
      top: -5px;
      font-size: 14px;
    }
  }
  &-bottom {
    margin: 0;
    padding-top: 20px;
  }
}

// 图表
.echart {
  .el-form {
    .el-form-item {
      margin-bottom: 0 !important;
    }
  }
  margin: 15px 0;
  &-content {
    width: 100%;
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  &-item {
    flex: 1;
    // height: 340px;
    min-width: 450px;
    .head {
      font-size: 16px;
    }
    .cont {
      height: 340px;
    }
  }
  &-footItem {
    &:nth-child(1) {
      flex: 2;
      min-width: 450px;
    }
    &:nth-child(2) {
      flex: 1;
      min-width: 200px;
    }
    .head {
      font-size: 16px;
    }
    .cont {
      height: 340px;
      .zhl {
        text-align: center;
        padding-top: 60px;
        p {
          &:nth-last-child(1) {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
