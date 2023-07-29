<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '工作台' } }].concat(matched)

        // 我添加的
        if (first?.instances?.default?.$root._route.name === 'FactoryCosts') {
          // 在倒数第二插入
          matched.splice(2, 0, { path: '/SupplyChain/Factory', meta: { title: '工厂' } })
        } else if (['AddFinishedProduct', 'EditFinishedProduct'].includes(first?.instances?.default?.$root._route.name)) {
          // 在倒数第二插入
          matched.splice(2, 0, { path: '/FinishedProductManagement/FinishedProductManage', meta: { title: '成品管理' } })
        } else if (['AddTransferOrder'].includes(first?.instances?.default?.$root._route.name)) {
          // 在倒数第二插入
          matched.splice(2, 0, { path: '/FinishedProductManagement/TransferOrder', meta: { title: '调拨订单' } })
        } else if (['processParams', 'volumeParams', 'processOption'].includes(first?.instances?.default?.$root._route.name)) {
          // 在倒数第二插入
          matched.splice(2, 0, { path: '/CustomizedProducts/CustomizedProducts', meta: { title: '定制产品' } })
        } else if (['SettingStore'].includes(first?.instances?.default?.$root._route.name)) {
          // 门店配置
          matched.splice(2, 0, { path: '/Account/StoreManagement', meta: { title: '门店管理' } })
        } else if (['Article', 'AddArticle', 'EditArticle'].includes(first?.instances?.default?.$root._route.name)) {
          // 内容管理文章列表
          matched.splice(2, 0, { path: '/MiniProgram/ContentManagement', meta: { title: '内容管理' } })
        } else if (['AddEvent', 'EditEvent'].includes(first?.instances?.default?.$root._route.name)) {
          // 新增编辑活动管理
          matched.splice(2, 0, { path: '/MiniProgram/EventManagement', meta: { title: '活动管理' } })
        } else if (['OrderDetails'].includes(first?.instances?.default?.$root._route.name)) {
          // 订单管理
          matched.splice(2, 0, { path: '/CustomizedProducts/OrderManagement', meta: { title: '订单管理' } })
        }
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
