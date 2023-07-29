<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddPayMethod">添加</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+30" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="名称" prop="name">
            <template slot-scope="{row}">
              {{row.name}} <el-tag v-if="row.isSystemDefault">系统默认</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="400">
            <template slot-scope="{row}">
              <el-button v-if="row.status=='已禁用'" icon="el-icon-turn-off" type="primary" @click="handleEnable(row)">启用</el-button>
              <el-button v-if="row.status=='已启用'" icon="el-icon-open" type="danger" @click="handleDisable(row)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageWrap>

    <!-- 添加支付方式  -->
    <el-dialog title="添加支付方式" :visible.sync="PayMethodDialog.visible" width="400px" @closed="closePayMethodDialog">
      <el-form ref="PayMethodRef" :model="PayMethodDialog.Form" :rules="PayMethodDialog.Rules" label-width="50px">
        <el-form-item label="名称" prop="Name">
          <el-input maxlength="30" v-model="PayMethodDialog.Form.Name" clearable placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="PayMethodDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitSpecialBody('PayMethodRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PaymentMethodManagement",
  data() {
    return {
      submitLoading: false,
      tableLoading: false,
      tableDataList: [],
      PayMethodDialog: {
        visible: false,
        Form: {
          Name: "",
        },
        Rules: {
          Name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入名称', trigger: 'blur' }
          ],
        },
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "已启用": 'success',
        "已禁用": 'info',
      }
      return statusMap[status]
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
          { id: 1, name: '银行卡', isSystemDefault: true, status: '已启用' },
          { id: 2, name: '微信', isSystemDefault: true, status: '已启用' },
          { id: 3, name: '支付宝', isSystemDefault: true, status: '已启用' },
          { id: 4, name: '现金', isSystemDefault: true, status: '已禁用' },
          { id: 5, name: 'pos', isSystemDefault: true, status: '已禁用' },
          { id: 6, name: '收钱吧', isSystemDefault: false, status: '已启用' },
          { id: 7, name: '会员卡付款', isSystemDefault: true, status: '已启用' },
          { id: 8, name: '积分付款', isSystemDefault: false, status: '已启用' },
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 添加支付方式 打开
    handleAddPayMethod() {
      this.PayMethodDialog.visible = true;
    },
    // 添加支付方式 点击确定
    handleSubmitSpecialBody(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.PayMethodDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 添加支付方式 关闭
    closePayMethodDialog() {
      this.$refs['PayMethodRef'].resetFields();
    },

    // 启用
    handleEnable(row) {
      // row.status = "已启用"
      this.$message.success('操作成功')
      this.initData();
    },
    // 禁用
    handleDisable(row) {
      this.$confirm('确认禁用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.status = "已禁用"
        this.$message.success('操作成功')
        this.initData();
      }).catch(() => { });
    },
  }
}
</script>

<style>
</style>