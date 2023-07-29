<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddAccount">添加</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+30" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="账号" prop="Account" min-width="300" show-overflow-tooltip>
            <template slot-scope="{row}">
              <div class="Account_wrap">
                <span>{{row.Account}}</span>
                <div class="tag"><el-tag v-for="item,index in row.roleList" :key="index">{{item}}</el-tag></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用户号" prop="UserID" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="真实名" prop="RealName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.Status | statusFilter">{{row.Status}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="300" fixed="right">
            <template slot-scope="{row}">
              <el-button v-if="row.Status=='已禁用'" icon="el-icon-turn-off" type="success" @click="handleEnable(row)">启用</el-button>
              <el-button v-if="row.Status=='已启用'" icon="el-icon-open" type="danger" @click="handleDisable(row)">禁用</el-button>
              <el-button icon="el-icon-edit" type="primary" @click="handleEditAccount(row)">编辑</el-button>
              <el-button icon="el-icon-refresh" type="warning" @click="handleReset(row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageWrap>

    <!-- 添加编辑账户  -->
    <el-dialog :title="AccountDialog.title" :visible.sync="AccountDialog.visible" width="550px" @closed="closeAccountDialog">
      <el-form ref="AccountDialogRef" :model="AccountDialog.Form" :rules="AccountDialog.Rules" label-width="80px">
        <el-form-item label="账号" prop="Account">
          <el-input maxlength="30" :disabled="AccountDialog.title.includes('编辑')" v-model="AccountDialog.Form.Account" clearable placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="真实名" prop="RealName">
          <el-input maxlength="30" v-model="AccountDialog.Form.RealName" clearable placeholder="请输入真实名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="Role">
          <el-checkbox-group v-model="AccountDialog.Form.Role">
            <el-checkbox v-for="item in AccountDialog.RoleList" :key="item.id" :label="item.name"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="AccountDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitAccount('AccountDialogRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AccountManagement",
  data() {
    return {
      submitLoading: false,
      tableLoading: false,
      tableDataList: [],
      AccountDialog: {
        title: "",
        visible: false,
        RoleList: [{ id: 1, name: '品牌操作员' }, { id: 2, name: '品牌财务' }, { id: 3, name: '品牌专员' }, { id: 4, name: '品牌下单专员' }],
        Form: {
          id: "",
          Account: '',
          RealName: '',
          Role: ['品牌下单专员'],
        },
        Rules: {
          Account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入账号', trigger: 'blur' }
          ],
          RealName: [
            { required: true, message: '请输入真实名', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入真实名', trigger: 'blur' }
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
          { id: 1, Account: 'admin', roleList: ['品牌操作员', '品牌财务', '品牌专员'], UserID: '2342346', RealName: '张三丰', Status: '已启用' },
          { id: 2, Account: 'admin1', roleList: ['品牌下单专员'], UserID: '2342346', RealName: '张三丰', Status: '已启用' },
          { id: 3, Account: 'admin2', roleList: ['品牌操作员'], UserID: '2342346', RealName: '张三丰', Status: '已禁用' },
          { id: 4, Account: 'admin3', roleList: ['品牌操作员'], UserID: '2342346', RealName: '张三丰', Status: '已禁用' },
          { id: 5, Account: 'admin4', roleList: ['品牌操作员'], UserID: '2342346', RealName: '张三丰', Status: '已启用' },
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 新增编辑账号弹框 打开(新增)
    handleAddAccount() {
      this.AccountDialog.title = '新增账号';
      this.AccountDialog.visible = true;
    },
    // 新增编辑账号弹框 打开(编辑)
    handleEditAccount(row) {
      this.AccountDialog.title = '编辑账号';
      this.AccountDialog.visible = true;

      this.AccountDialog.Form = {
        id: row.id,
        Account: row.Account,
        RealName: row.RealName,
        Role: row.roleList,
      }


    },
    // 新增编辑账号弹框 点击确定
    handleSubmitAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.AccountDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 新增编辑账号弹框 关闭
    closeAccountDialog() {
      this.$refs['AccountDialogRef'].resetFields();
      this.AccountDialog.Form = {
        id: "",
        Account: "",
        RealName: "",
        Role: ['品牌下单专员'],
      }
    },

    // 启用
    handleEnable(row) {
      // row.status = "已启用"
      this.$message.success('操作成功')
      this.initData();
    },
    // 禁用
    handleDisable(row) {
      this.$confirm('禁用后，账号不能再登录，确认吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.status = "已禁用"
        this.$message.success('操作成功')
        this.initData();
      }).catch(() => { });
    },
    // 重置该账号
    handleReset(row) {
      this.$confirm('确定重置该账号的密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('重置成功')
        this.initData();
      }).catch(() => { });
    }
  }
}
</script>

<style scoped lang="scss">
.Account_wrap {
  display: flex;
  gap: 10px;
  .tag {
    display: flex;
    gap: 10px;
  }
}
</style>