<template>
  <el-dialog title="制衣单流转日志" :visible.sync="isShowDialog" top="8vh" width="700px" @closed="onClosedDialog">
    <el-table v-loading="tableLoading" class="hhy-table" height="400" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
      <!-- 序号 -->
      <el-table-column type="index" label="序号" />
      <el-table-column label="日志" prop="log"></el-table-column>
      <el-table-column label="操作人" prop="people"></el-table-column>
      <el-table-column label="操作时间" prop="date"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script> 
export default {
  props: {
    // 是否显示
    isShow: { type: Boolean, default: false },
    id: { type: Number, default: 0 }
  },
  data() {
    return {
      isShowDialog: false, // 是否显示弹框 
      tableDataList: [],
      tableLoading: false,
    }
  },
  watch: {
    // 监听父组件传过来的值 是否显示弹框
    isShow: function (val) {
      this.isShowDialog = val;
    },
    // 监听当前页面弹框是否显示
    isShowDialog: function (val) {
      this.showDialog(val)
    },
    id(val) {
      this.getData(val)
    }
  },
  methods: {
    // 修改父组件弹框show的值  dialogOption.isShowDialog
    showDialog(isShow) {
      this.$emit('update:isShow', isShow) // isShowDialog改变时同步父组件show的值
    },

    // 获取数据
    getData(id) {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { log: '订单支付', people: '张三丰', date: '2023-11-11 12:12:12' },
          { log: '提交到门店', people: '张三丰', date: '2023-11-11 12:12:12' },
          { log: '下制衣单', people: '张三丰', date: '2023-11-11 12:12:12' },
          { log: '签收面料', people: '张三丰', date: '2023-11-11 12:12:12' },
        ]
        this.tableLoading = false;
      }, 500);
    },
    // 关闭弹框
    onClosedDialog() {

    },
  }
}
</script>

<style>
</style>