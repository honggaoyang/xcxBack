<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddSrore">添加门店</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+15" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
          <el-table-column label="门店" min-width="120" show-overflow-tooltip>
            <template slot-scope="{row}">
              <div class="Store_wrap">
                <span>{{row.Store}}</span>
                <div class="tag"><el-tag :type="row.Status | statusFilter">{{row.Status}}</el-tag></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="管理账号" prop="Accounts" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="联系人" prop="Contacts" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="联系电话" prop="Phone" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="地址" prop="Address" min-width="150" show-overflow-tooltip></el-table-column>

          <el-table-column label="操作" width="400" fixed="right">
            <template slot-scope="{row}">
              <el-button icon="el-icon-setting" plain type="primary" @click="handleSettingStore(row)">配置门店</el-button>
              <el-button icon="el-icon-edit" type="primary" @click="handleEditSrore(row)">编辑</el-button>
              <el-button v-if="row.Status=='已禁用'" icon="el-icon-turn-off" type="success" @click="handleEnable(row)">启用</el-button>
              <el-button v-if="row.Status=='已启用'" icon="el-icon-open" type="danger" @click="handleDisable(row)">禁用</el-button>
              <el-button icon="el-icon-refresh" type="warning" @click="handleReset(row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 添加编辑门店信息  -->
    <el-dialog :title="StoreDialog.title" top="8vh" :visible.sync="StoreDialog.visible" width="550px" @closed="closeStoreDialog">
      <el-form ref="StoreDialogRef" :model="StoreDialog.Form" :rules="StoreDialog.Rules" label-width="80px">
        <el-form-item label="门店" prop="Store">
          <el-input maxlength="30" v-model="StoreDialog.Form.Store" clearable placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="Code">
          <el-input maxlength="30" v-model="StoreDialog.Form.Code" clearable placeholder="门店编码用户产生订单号"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="Address">
          <el-input maxlength="100" v-model="StoreDialog.Form.Address" clearable placeholder="输入地址"></el-input>
        </el-form-item>
        <el-form-item label="经纬度" prop="Location">
          <div class="location_wrap">
            <div class="input">
              <el-input maxlength="50" v-model="StoreDialog.Form.Location" clearable placeholder="经度,纬度，例:118.793563,32.029724"></el-input>
            </div>
            <div class="href">
              <el-link href="https://lbs.amap.com/console/show/picker" target="_blank" type="primary">去高德地图拾取坐标</el-link>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="联系人" prop="Contacts">
          <el-input maxlength="10" v-model="StoreDialog.Form.Contacts" clearable placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="Phone">
          <el-input maxlength="11" v-model="StoreDialog.Form.Phone" clearable placeholder="请输入联系人电话" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="LoginName">
          <el-input maxlength="30" v-model="StoreDialog.Form.LoginName" clearable placeholder="输入门店账号的登录名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="StoreDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitStore('StoreDialogRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StoreManagement",
  data() {
    return {
      submitLoading: false,
      tableLoading: false,
      tableDataList: [],
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },
      // 新增编辑门店
      StoreDialog: {
        title: "",
        visible: false,
        Form: {
          id: "",
          Store: '',
          Code: '',
          Address: '',
          Location: '',
          Contacts: '',
          Phone: '',
          LoginName: '',
        },
        Rules: {
          Store: [
            { required: true, message: '请输入门店名称', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入门店名称', trigger: 'blur' }
          ],
          Code: [
            { required: true, message: '请输入门店编码', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入门店编码', trigger: 'blur' }
          ],
          Address: [
            { required: true, message: '请输入门店地址', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入门店地址', trigger: 'blur' }
          ],
          Location: [
            { required: true, message: '请输入门店经纬度', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入门店经纬度', trigger: 'blur' }
          ],
          Contacts: [
            { required: true, message: '请输入门店联系人', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入门店联系人', trigger: 'blur' }
          ],
          Phone: [
            { required: true, message: '请输入门店联系人电话', trigger: 'blur' },
            { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          LoginName: [
            { required: true, message: '请输入门店登录名', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入门店登录名', trigger: 'blur' }
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
          { id: 1, Store: '北京店', Status: '已启用', Accounts: 'xxwx0001', Contacts: '张三丰', Phone: '13011053225', Address: '北京市海淀区' },
          { id: 2, Store: '天津店', Status: '已启用', Accounts: 'xxwx0002', Contacts: '张三丰', Phone: '13011053225', Address: '北京市海淀区' },
          { id: 3, Store: '南京店', Status: '已禁用', Accounts: 'xxwx0003', Contacts: '张三丰', Phone: '13011053225', Address: '北京市海淀区' },
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 新增编辑门店弹框 打开(新增)
    handleAddSrore() {
      this.StoreDialog.title = '新增门店';
      this.StoreDialog.visible = true;
    },
    // 新增编辑门店弹框 打开(编辑)
    handleEditSrore(row) {
      this.StoreDialog.title = '编辑门店';
      this.StoreDialog.visible = true;
      this.StoreDialog.Form = {
        id: row.id,
        Store: row.Store,
        Code: '',
        Address: row.Address,
        Location: '',
        Contacts: row.Contacts,
        Phone: row.Phone,
        LoginName: row.Accounts,
      }
    },
    // 新增编辑门店弹框 点击确定
    handleSubmitStore(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.StoreDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 新增编辑门店弹框 关闭
    closeStoreDialog() {
      this.$refs['StoreDialogRef'].resetFields();
      this.StoreDialog.Form = {
        id: "",
        Store: '',
        Code: '',
        Address: '',
        Location: '',
        Contacts: '',
        Phone: '',
        LoginName: '',
      }
    },

    // 配置门店
    handleSettingStore(row) {
      this.$router.push(`/Account/SettingStore/${row.id}/${row.Store}`)
    },
    // 启用
    handleEnable(row) {
      // row.status = "已启用"
      this.$message.success('操作成功')
      this.initData();
    },
    // 禁用
    handleDisable(row) {
      this.$confirm('禁用后，该门店将不可使用，确认吗?', '提示', {
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
.Store_wrap {
  display: flex;
  justify-content: center;
  gap: 10px;
  .tag {
    display: flex;
    gap: 10px;
  }
}
.location_wrap {
  display: flex;
  gap: 10px;
  .input {
    flex: 1;
  }
  .href {
    width: 140px;
  }
}
</style>