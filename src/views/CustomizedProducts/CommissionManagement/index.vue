<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+15" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
          <el-table-column label="订单号" min-width="180" prop="orderNumber" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单金额" prop="amount" show-overflow-tooltip></el-table-column>
          <el-table-column label="合伙人" prop="partner" show-overflow-tooltip></el-table-column>
          <el-table-column label="佣金比例" prop="commissionRate" show-overflow-tooltip></el-table-column>
          <el-table-column label="佣金" prop="commission" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="{row}">
              <el-button v-if="row.status==0" icon="el-icon-box" type="success" @click="handleRefund(row)">返款</el-button>
              <el-button v-if="row.status==1" icon="el-icon-search" type="primary" @click="handleSearchRefund(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 返款凭证  -->
    <el-dialog :title="RefundDialog.title" top="8vh" :visible.sync="RefundDialog.visible" width="550px" @closed="closeRefundDialog">
      <el-form ref="FormRef" :model="RefundDialog.Form" :inline="false" :rules="RefundDialog.FormRules" label-width="50px">
        <el-form-item label="凭证" prop="imgList">
          <myUploadMore :disabled="RefundDialog.title.includes('查看')" v-model="RefundDialog.Form.imgList" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input :disabled="RefundDialog.title.includes('查看')"  type="textarea" maxlength="500" autosize v-model="RefundDialog.Form.remarks" placeholder="请输入返款备注"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" v-if="!RefundDialog.title.includes('查看')">
        <el-button @click="RefundDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitRefund('FormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myUploadMore from "@/components/el-uploadMore";  // 上传多张
export default {
  name: "CommissionManagement",
  components: {
    myUploadMore,
  },
  data() {
    return {
      tableLoading: false, // table 加载状态
      submitLoading: false, // 提交加载状态
      tableDataList: [],
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },
      // 返款
      RefundDialog: {
        title: "",
        visible: false,
        Form: {
          imgList: [],
          remarks: "",
        },
        FormRules: {
          remarks: [
            { required: true, message: '请输入返款备注', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入返款备注', trigger: 'blur' }
          ],
        }
      }
    }
  },
  created() {
    // 初始化数据
    this.initData()
  },
  methods: {
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { id: 1, orderNumber: 'WZNJ08638230508114813', amount: '￥4200.00', partner: '小红书', commissionRate: '2%', commission: "￥42.00", status: 0 },
          { id: 2, orderNumber: 'WZNJ08638230508114813', amount: '￥4200.00', partner: '小红书', commissionRate: '2%', commission: "￥42.00", status: 0 },
          { id: 3, orderNumber: 'WZNJ08638230508114813', amount: '￥4200.00', partner: '小红书', commissionRate: '2%', commission: "￥42.00", status: 1 }
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 打开返款凭证弹框
    handleRefund(row) {
      this.RefundDialog.title = "返款凭证";
      this.RefundDialog.visible = true;
    },
    // 返款凭证弹框 点击确定
    handleSubmitRefund(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.RefundDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("返款成功")
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 关闭返款凭证弹框
    closeRefundDialog() {
      this.$refs['FormRef'].resetFields();
    },

    // 查看返款详情
    handleSearchRefund(row) {
      this.RefundDialog.title = "查看返款凭证";
      this.RefundDialog.Form.remarks = '我是备注'
      this.RefundDialog.visible = true;
    }
  }
}
</script>

<style>
</style>