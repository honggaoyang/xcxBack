<template>
  <div class="hhy-container">
    <div class="hhy-tips">
      <p>{{name}}</p>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="门店价格体系">
        <StorePriceSystem />
      </el-tab-pane>
      <el-tab-pane label="面料调价" :lazy="true">
        <FabricSettingPrice />
      </el-tab-pane>
      <el-tab-pane label="成品调价" :lazy="true">
        <FinishedProductSettingPrice />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StorePriceSystem from "./components/StorePriceSystem.vue"
import FabricSettingPrice from "./components/FabricSettingPrice.vue"
import FinishedProductSettingPrice from "./components/FinishedProductSettingPrice.vue"


export default {
  name: "SettingStore",
  components: { StorePriceSystem, FabricSettingPrice, FinishedProductSettingPrice },
  data() {
    return {
      id: "",
      name: "",
    }
  },
  created() {
    this.id = this.$route.params.id
    this.name = this.$route.params.name
  },
}
</script>

<style lang="scss" scoped>
.hhy-tips {
  margin-top: 15px;
}
</style>