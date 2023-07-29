<template>
  <div class="hhy-container">
    <div>
      <!-- 基本信息 -->
      <el-card class="box-card BasicInfo">
        <div class="BasicInfo-content">
          <div>
            <div><svg-icon class="headIcon" icon-class="MaleAvatar" /></div>
          </div>
          <div class="info">
            <span>姓名：张三丰</span>
            <span>门店：上海店</span>
            <span>最近消费：￥8000.00</span>
            <span>成为客户：2023-07-07</span>
            <span>备注：无</span>
          </div>
        </div>
      </el-card>

      <!-- 客户资料 -->
      <el-card class="box-card">
        <div slot="header" class="card-head">
          <span>客户资料</span>
        </div>
        <div>
          <p>性别：女</p>
          <p>出生：1880-01-01</p>
          <p>身高：180</p>
          <p>体重：89</p>
          <p>联系电话：13011053225</p>
          <p>地区：苏州</p>
        </div>
      </el-card>
    </div>
    <div>
      <!-- 交易统计 -->
      <el-card class="box-card statistics">
        <div slot="header" class="card-head">
          <span>交易统计</span>
          <router-link :to="{name:'OrderManagement',query:{phone:13011053225}}">
            <el-button type="text">累计订单</el-button>
          </router-link>
        </div>
        <div class="statistics-content">
          <div class="item">
            <span>累计消费金额（元）</span>
            <span>82437.10</span>
          </div>
          <div class="item">
            <span>累计订单数量</span>
            <span>10</span>
          </div>
          <div class="item">
            <span>最近消费金额</span>
            <span>82437.10</span>
          </div>
          <div class="item">
            <span>最近消费时间</span>
            <span>2023-06-29 12:32</span>
          </div>
        </div>
      </el-card>

      <!-- 量体数据 -->
      <el-card class="box-card Volume">
        <div slot="header" class="card-head">
          <span>量体数据</span>
        </div>
        <div>
          <p>领围：68</p>
          <p>肩宽：12</p>
          <p>全胸围/胸围：180</p>
          <p>胸高点：89</p>
          <p>肚围/腹围：33</p>
          <p>臀围：55</p>
          <p>后腰节：77</p>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CustomerManagement-Detail',
  data() {
    return {

    }
  },
  created() {
    console.log(this.$route.params.id);
  }
}
</script>

<style scoped lang="scss">
.card-head {
  font-size: 16px;
}
.box-card {
  margin-top: 15px;
}
// 基本信息
.BasicInfo {
  &-content {
    display: flex;
    // flex-wrap: wrap;
    gap: 15px;
    .headIcon {
      width: 125px;
      height: 125px;
    }
    > .info {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
}

.statistics {
  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button {
      padding: 3px 0;
    }
  }
  &-content {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    .item {
      flex: 1;
      min-width: 170px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      align-items: center;
      span {
        &:nth-last-child(1) {
          font-weight: 700;
          font-size: 18px;
        }
      }
    }
  }
}
</style>