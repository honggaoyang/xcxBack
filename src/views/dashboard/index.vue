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
    <!-- 待办事项 -->
    <el-card class="toDoList">
      <div slot="header" class="card-head">
        <span>待办事项</span>
      </div>
      <div class="toDoList-content">
        <div class="toDoList-item">
          <p>处理制单衣服</p>
          <p>28</p>
        </div>
        <div class="toDoList-item">
          <p>完善面料信息</p>
          <p>55</p>
        </div>
        <div class="toDoList-item">
          <p>预约确认</p>
          <p>0</p>
        </div>
      </div>
    </el-card>

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
      <div class="echart-content">
        <!-- 渠道收入 -->
        <div class="echart-item">
          <echarts ref="echarts1" />
        </div>
        <!-- 渠道客户 -->
        <div class="echart-item">
          <echarts ref="echarts2" />
        </div>
      </div>
      <div class="echart-content">
        <!-- 品类销售情况 -->
        <div class="echart-item">
          <echarts ref="echarts3" />
        </div>
        <!-- 近期收益 订单 -->
        <div class="echart-item">
          <echarts ref="echarts4" />
        </div>
      </div>
    </el-card>

    <!-- 排名 -->
    <div class="ranking">
      <el-card class="ranking-card">
        <div slot="header" class="card-head">
          <span>门店排名</span>
          <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
        </div>
        <div class="ranking-content">
          <div class="ranking-item" v-for="i in 4" :key="i">
            <div>{{i}}</div>
            <div><el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar></div>
            <div>
              <span>北京店</span>
              <span>ID：59</span>
            </div>
            <div>300单</div>
          </div>
        </div>
      </el-card>
      <el-card class="ranking-card">
        <div slot="header" class="card-head">
          <span>面料商排名</span>
          <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
        </div>
        <div class="ranking-content">
          <div class="ranking-item" v-for="i in 4" :key="i">
            <div>{{i}}</div>
            <div><el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar></div>
            <div>
              <span>北京店</span>
            </div>
            <div>￥300</div>
          </div>
        </div>
      </el-card>
      <el-card class="ranking-card">
        <div slot="header" class="card-head">
          <span>用料排名</span>
          <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
        </div>
        <div class="ranking-content">
          <div class="ranking-item" v-for="i in 4" :key="i">
            <div>{{i}}</div>
            <div><el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar></div>
            <div>
              <span>北京店</span>
              <span>ID：59</span>
            </div>
            <div>300米</div>
          </div>
        </div>
      </el-card>
      <el-card class="ranking-card">
        <div slot="header" class="card-head">
          <span>工厂排名</span>
          <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
        </div>
        <div class="ranking-content">
          <div class="ranking-item" v-for="i in 4" :key="i">
            <div>{{i}}</div>
            <div><el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar></div>
            <div>
              <span>北京店</span>
              <span>ID：59</span>
            </div>
            <div>￥300</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 动态 -->
    <div class="trends">
      <el-card class="trends-card">
        <div slot="header" class="card-head">
          <span>动态</span>
        </div>
        <div class="trends-content">
          <div class="trends-item" v-for="i in 10" :key="i">
            <div><el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar></div>
            <div>
              <p>北京店<el-link type="primary">订单(WZNJ09882230711164208)</el-link>设置为已支付</p>
              <p>2023-07-11 16:42</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import echarts from "@/components/echarts";
export default {
  name: 'Dashboard',
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
    // 渠道收入
    initEcharts1() {
      let option = {
        title: {
          text: '渠道收入',
          subtext: '￥2000',
          left: '5%',
          top: '5%',
          textStyle: {
            fontSize: 24, //字体大小
            lineHeight: 24 //字体行高
          },
          subtextStyle: {
            color: '#464646',
            fontSize: 24, //字体大小
            lineHeight: 45, //字体行高
            fontWeight: "bolder",
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          bottom: '5%',
          left: '5%'
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
            center: ['60%', '57%'],
            data: [
              { value: 1048, name: '其他' },
              { value: 735, name: '美团' },
              { value: 580, name: '百度' },
              { value: 484, name: '快手' },
              { value: 300, name: '抖音' }
            ]
          }
        ]
      };
      this.$refs.echarts1.setOption(option)
    },
    // 渠道客户
    initEcharts2() {
      let option = {
        title: {
          text: '渠道客户',
          subtext: '1000',
          left: '5%',
          top: '5%',
          textStyle: {
            fontSize: 24, //字体大小
            lineHeight: 24 //字体行高
          },
          subtextStyle: {
            color: '#464646',
            fontSize: 24, //字体大小
            lineHeight: 45, //字体行高
            fontWeight: "bolder",
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          bottom: '5%',
          left: '5%'
        },
        series: [
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
            center: ['60%', '57%'],
            data: [
              { value: 1048, name: '其他' },
              { value: 735, name: '美团' },
              { value: 580, name: '百度' },
              { value: 484, name: '快手' },
              { value: 300, name: '抖音' }
            ]
          }
        ]
      };
      this.$refs.echarts2.setOption(option)
    },
    // 当年品类销售情况
    initEcharts3() {
      let option = {
        title: {
          text: '当年品类销售情况',
          left: '5%',
          top: '5%',
          textStyle: {
            fontSize: 24, //字体大小
            lineHeight: 24 //字体行高
          },
          subtextStyle: {
            color: '#000000',
            fontSize: 24, //字体大小
            lineHeight: 45, //字体行高
            fontWeight: "bolder",
          }
        },
        // tooltip: {
        //   trigger: 'item',
        //   formatter: '{a} <br/>{b} : {c} ({d}%)'
        // },
        legend: {
          orient: 'vertical',
          bottom: '5%',
          left: '5%'
        },
        series: [
          {
            name: '当年品类销售情况',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              formatter: '{b} \n\n {c} ({d}%)'
            },
            labelLine: {
              show: true,
              smooth: true
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              },
            },
            center: ['60%', '57%'],
            data: [
              { value: 1048, name: '上衣' },
              { value: 735, name: '西裤' },
              { value: 530, name: '马甲' },
              { value: 484, name: '衬衫' },
              { value: 140, name: '大衣' },
              { value: 200, name: '风衣' },
              { value: 600, name: '针织衫' },
              { value: 230, name: '毛衣' },
              { value: 180, name: '皮鞋' }
            ]
          }
        ]
      };
      this.$refs.echarts3.setOption(option)
    },
    // 近期收益 订单
    initEcharts4() {
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
          data: ['近期订单', '近期收益'],
          top: 30,
          left: 50,
        },
        xAxis: {
          type: 'category',
          data: ['2023-06-01', '2023-06-02', '2023-06-03', '2023-06-04', '2023-06-05']
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          top: 100,
          left: 50,
          right: 50,
          bottom: 15, //生成的图片和顶部的间距
          containLabel: true //为ture才会生效
        },
        series: [
          {
            name: '近期订单',
            data: [900, 1000, 1250, 1230, 1500],
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 单';
              }
            }
          },
          {
            name: '近期收益',
            data: [1000, 800, 900, 680, 770],
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return '￥ ' + value;
              }
            }
          }
        ]
      };
      this.$refs.echarts4.setOption(option)
    }
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

// 待办事项
.toDoList {
  margin-top: 15px;
  &-content {
    display: flex;
    gap: 0 100px;
  }
  &-item {
    flex-shrink: 0;
    p {
      margin: 0;
      text-align: center;
      &:nth-child(2) {
        margin-top: 15px;
        color: $hhy_primary_color;
        font-size: 50px;
      }
    }
  }
}

// 图表
.echart {
  .el-form {
    text-align: right;
    padding-right: 45px;
  }
  margin-top: 15px;
  &-content {
    display: flex;
    flex-wrap: wrap;
  }
  &-item {
    flex: 1;
    height: 340px;
    min-width: 450px;
  }
}

// 排名
.ranking {
  display: flex;
  gap: 0 15px;
  flex-wrap: wrap;
  &-card {
    flex: 1;
    margin-top: 15px;
    min-width: 300px;
  }
  &-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  &-item {
    display: flex;
    align-items: center;
    gap: 10px;
    div {
      &:nth-child(1) {
        color: #8b8686;
      }
      &:nth-child(3) {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 5px;
        overflow: hidden;
        span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:nth-child(2) {
            color: $hhy_gray_color;
          }
        }
      }
      &:nth-child(4) {
        color: $hhy_primary_color;
      }
    }
  }
}

// 动态
.trends {
  &-card {
    margin-top: 15px;
  }
  &-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  &-item {
    display: flex;
    align-items: center;
    gap: 15px;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 15px;
    div {
      &:nth-child(2) {
        display: flex;
        flex-direction: column;
        gap: 5px 0;
      }
      p {
        margin: 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        &:nth-child(2) {
          color: $hhy_gray_color;
        }
      }
    }
  }
}
</style>
