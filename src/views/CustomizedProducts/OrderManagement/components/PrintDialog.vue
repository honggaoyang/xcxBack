<template>
  <el-dialog title="订单打印" :visible.sync="isShowDialog" top="8vh" width="80%" @closed="onClosedDialog">
    <div id="printTable">
      <table class="table_wrap">
        <tr>
          <th colspan="5">
            <div class="th_wrap">
              <el-image src="http://resource.vxiaocheng.com/dust/assets/img/suit_logo.png" :preview-src-list="['http://resource.vxiaocheng.com/dust/assets/img/suit_logo.png']"> </el-image>
              <div>北京店</div>
              <div>订单号:WZNJ10277230728121053</div>
            </div>
          </th>
        </tr>
        <tr>
          <td>顾户姓名：张三丰</td>
          <td>性别：男</td>
          <td>年龄：33岁</td>
          <td>身高：150cm</td>
          <td>体重：56kg</td>
        </tr>
        <tr>
          <td>联系电话：13011111111</td>
          <td>第2联系人：</td>
          <td>联系电话：</td>
          <td>定制顾问：张无忌</td>
          <td>量体师：赵敏</td>
        </tr>
        <tr>
          <td>定制日期：2023-07-28</td>
          <td>使用日期：</td>
          <td>取件日期：</td>
          <td colspan="2">取件签字：</td>
        </tr>
      </table>
      <table class="table_wrap" style="margin-top:-1px;text-algin:center">
        <tr>
          <th colspan="6">
            定制内容
          </th>
        </tr>
        <tr>
          <th>子订单号</th>
          <th>定制产品</th>
          <th>面料品牌</th>
          <th>定制价格</th>
          <th>套装合并价格</th>
          <th>售价确认</th>
        </tr>
        <tr>
          <td>WZNJ10277230728121053-1</td>
          <td>西服</td>
          <td>乔丹</td>
          <td>¥ 2212.65</td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
    <span slot="footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" v-print="printTable">打 印</el-button>
    </span>
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
      printTable: {
        id: "printTable", //打印的ID，与打印内容的盒子id一致
        popTitle: "打印订单", //打印的标题
      }
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

<style scoped lang="scss">
.table_wrap {
  width: 100%;
  line-height: 40px;
  border-collapse: collapse;
  border: 1px solid #ccc;
  td,
  th {
    border-collapse: collapse;
    border: 1px solid #ccc;
    padding: 0 10px;
  }
  .th_wrap {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-image {
      width: 50px;
      height: 50px;
    }
  }
}

// @media print {
//   #printTable {
//     zoom: 100%; //调整打印缩放
//   }
// }
</style>