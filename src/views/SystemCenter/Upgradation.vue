<template>
  <div class="hhy-container">
    <div class="Upgradation hhy-card">
      <!-- 基础版 -->
      <div class="Upgradation-item">
        <div class="title">
          <p>基础版</p>
          <p>基础功能，满足需求</p>
        </div>
        <div class="btnMenu">
          <el-button type="primary" @click="handleApplyUpgrade('基础版')">申请升级</el-button>
          <el-button type="primary" @click="handleContact">联系客服</el-button>
        </div>
        <div class="cont">
          <p class="tips">功能</p>
          <ul>
            <li v-for="i in 10" :key="i"><i class="el-icon-success"></i> 多功能数据中心{{i}}</li>
          </ul>
        </div>
      </div>
      <!-- 单店版 -->
      <div class="Upgradation-item">
        <div class="title">
          <p>单店版</p>
          <p>上手简单，注册即用</p>
        </div>
        <div class="btnMenu">
          <el-button type="primary" @click="handleApplyUpgrade('单店版')">申请升级</el-button>
          <el-button type="primary" @click="handleContact">联系客服</el-button>
        </div>
        <div class="cont">
          <p class="tips">功能</p>
          <ul>
            <li v-for="i in 10" :key="i"><i class="el-icon-success"></i> 多功能数据中心{{i}}</li>
          </ul>
        </div>
      </div>
      <!-- 品牌版 -->
      <div class="Upgradation-item">
        <div class="title">
          <p>品牌版</p>
          <p>功能升级，助力品牌</p>
        </div>
        <div class="btnMenu">
          <el-button type="primary" @click="handleApplyUpgrade('品牌版')">申请升级</el-button>
          <el-button type="primary" @click="handleContact">联系客服</el-button>
        </div>
        <div class="cont">
          <p class="tips">功能</p>
          <ul>
            <li v-for="i in 15" :key="i"><i class="el-icon-success"></i> 多功能数据中心{{i}}</li>
          </ul>
        </div>
      </div>
      <!-- 定制版 -->
      <div class="Upgradation-item">
        <div class="title">
          <p>定制版</p>
          <p>企业定制，针对服务</p>
        </div>
        <div class="btnMenu">
          <el-button type="primary" @click="handleApplyUpgrade('定制版')">申请升级</el-button>
          <el-button type="primary" @click="handleContact">联系客服</el-button>
        </div>
        <div class="cont">
          <p class="tips">功能</p>
          <ul>
            <li><i class="el-icon-success"></i>全部功能</li>
            <li><i class="el-icon-success"></i>定制开发</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Upgradation",
  methods: {
    // 申请升级
    handleApplyUpgrade(name) {
      this.$message.success(`申请${name}成功`)
    },
    // 联系我们
    handleContact() {
      this.$message.success(`联系我们`)
    }
  }
}
</script>

<style scoped lang="scss">
$primary: #409eff;
$success: #67c23a;
$warning: #e6a23c;
$danger: #f56c6c;

.Upgradation {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  &-item {
    border: 1px solid #dedede;

    &:nth-child(1) {
      border-top: 8px solid $primary;
    }
    &:nth-child(2) {
      border-top: 8px solid $success;
    }
    &:nth-child(3) {
      border-top: 8px solid $warning;
    }
    &:nth-child(4) {
      border-top: 8px solid $danger;
    }
    padding: 15px;
    flex: 1;
    .title {
      p {
        margin: 0;
        &:nth-child(1) {
          font-size: 18px;
          margin-bottom: 15px;
        }
      }
    }
    .btnMenu {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }
    .cont {
      ul {
        margin: 0;
        padding: 0;
        li {
          list-style: none;
          line-height: 30px;
          i {
            color: $primary;
          }
        }
      }
    }
  }
}
</style>