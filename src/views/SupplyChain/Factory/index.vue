<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="工厂名称" prop="searchForm">
            <el-input v-model="searchForm.searchForm" clearable placeholder="输入工厂名称" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="initData" type="primary" class="hhy-search-btn" round>查询</el-button>
            <el-button @click="resetSearchForm('searchForm')" type="danger" class="hhy-reset-btn" round>重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" @click="AddFactoryDialog.visible=true" icon="el-icon-plus">添加工厂</el-button>
          <el-button type="warning" @click="ApplyFactoryDialog.visible=true" icon="el-icon-edit-outline">申请工厂</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="工厂" min-width="150" show-overflow-tooltip prop="factoryName" />
          <el-table-column label="显示别名" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="状态" min-width="100">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="联系人" min-width="100" prop="contacts" show-overflow-tooltip />
          <el-table-column label="联系电话" min-width="110" prop="phone" />
          <el-table-column label="地址" min-width="150" prop="address" show-overflow-tooltip />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="350">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="primary" @click="setCosts(row)">设置费用</el-button>
              <el-button icon="el-icon-edit" type="primary" @click="setAlias(row)">设置别名</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="handleDel(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 添加工厂 弹框 -->
    <el-dialog title="添加工厂" :visible.sync="AddFactoryDialog.visible" width="850px" @closed="closeAddFactoryDialog">
      <div>
        <!-- 搜索框 -->
        <div class="AddFactorySearch">
          <el-input placeholder="输入工厂名称" @keyup.enter.native="handleAddFactorySearch" clearable v-model="AddFactoryDialog.Search">
            <el-button type="primary" slot="append" icon="el-icon-search" @click="handleAddFactorySearch"></el-button>
          </el-input>
        </div>
        <!-- 表格 -->
        <el-table v-loading="AddFactoryDialog.tableLoading" height="350px" class="hhy-table" :data="AddFactoryDialog.TableList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}">
          <el-table-column type="index" label="序号" />
          <el-table-column label="工厂" min-width="100" show-overflow-tooltip prop="FactoryName" />
          <el-table-column label="联系人" min-width="100" prop="Name" show-overflow-tooltip />
          <el-table-column label="联系电话" min-width="110" prop="Phone" />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="{row}">
              <el-button v-if="row.status=='添加'" icon="el-icon-plus" type="primary" @click="handleAddFactory(row)">添加</el-button>
              <el-button v-else disabled type="primary">已添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 申请工厂 弹框 -->
    <el-dialog title="申请工厂" :visible.sync="ApplyFactoryDialog.visible" width="450px" @closed="closeApplyFactoryDialog">
      <el-form :model="ApplyFactoryDialog.Form" :rules="ApplyFactoryDialog.ApplyFactoryRules" ref="ApplyFactoryRef" label-width="80px">
        <el-form-item label="工厂" prop="FactoryName">
          <el-input maxlength="30" clearable placeholder="输入工厂名称" v-model="ApplyFactoryDialog.Form.FactoryName"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="Name">
          <el-input maxlength="10" clearable placeholder="输入工厂联系人" v-model="ApplyFactoryDialog.Form.Name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="Phone">
          <el-input maxlength="11" clearable placeholder="输入工厂联系电话" oninput="value=value.replace(/[^\d]/g,'')" v-model="ApplyFactoryDialog.Form.Phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ApplyFactoryDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitApplyFactory('ApplyFactoryRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置别名 弹框 -->
    <el-dialog title="工厂别名" :visible.sync="aliasDialog.visible" width="450px" @closed="closeAliasDialog">
      <el-form :model="aliasDialog.aliasForm" :rules="aliasDialog.aliasRules" ref="aliasRef" label-width="80px">
        <el-form-item label="显示别名" prop="name">
          <el-input maxlength="30" clearable placeholder="输入工厂别名" v-model="aliasDialog.aliasForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="aliasDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitAlias('aliasRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Factory',
  data() {
    return {
      searchForm: {
        name: "",
      },
      tableLoading: false, // table 加载状态
      tableDataList: [], // 表格数据
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },
      submitLoading: false, // 提交加载状态

      // 添加工厂 弹框相关
      AddFactoryDialog: {
        visible: false, // 添加工厂-弹框
        Search: "", // 添加工厂-弹框搜索内容
        tableLoading: false, // 添加工厂- 表格加载状态
        TableList: [], // 添加工厂-弹框表格数据
      },

      // 申请工厂 弹框相关
      ApplyFactoryDialog: {
        visible: false,//申请工厂弹框
        // 申请工厂表单
        Form: {
          FactoryName: "",
          Name: "",
          Phone: "",
        },
        // 申请工厂验证规则
        ApplyFactoryRules: {
          FactoryName: [
            { required: true, message: '请输入工厂名称', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入工厂名称', trigger: 'blur' }
          ],
          Name: [
            { required: true, message: '请输入工厂联系人', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入工厂联系人', trigger: 'blur' }
          ],
          Phone: [
            { required: true, message: '请输入工厂联系电话', trigger: 'blur' },
            { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
        },
      },

      // 设置别名 弹框相关
      aliasDialog: {
        visible: false,
        aliasForm: {
          name: "",
        },
        aliasRules: {
          name: [
            { required: true, message: '请输入工厂别名', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入工厂别名', trigger: 'blur' }
          ],
        },
      },
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "已启用": 'success',
        "已禁用": 'danger',
      }
      return statusMap[status]
    }
  },
  created() {
    // 初始化数据
    this.initData()
  },
  methods: {
    // 重置查询表单
    resetSearchForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { id: 1, factoryName: '衣洲服饰', alias: '衣洲有限服饰', status: '已启用', contacts: '张无忌', phone: '13011053225', address: '浙江省宁波市奉化区恒峰路33号3楼衣洲服饰有限公司' },
          { id: 2, factoryName: '简云服饰', alias: '简云有限服饰', status: '已启用', contacts: '张无忌', phone: '13011053225', address: '浙江省宁波市奉化区恒峰路33号3楼衣洲服饰有限公司' },
          { id: 3, factoryName: '泰兴市盛于蓝服饰厂', alias: '衣洲有限服饰', status: '已启用', contacts: '张无忌', phone: '13011053225', address: '浙江省宁波市奉化区恒峰路33号3楼衣洲服饰有限公司' },
          { id: 4, factoryName: '鲁泰纺织', alias: '', status: '已启用', contacts: '张无忌', phone: '13011053225', address: '浙江省宁波市奉化区恒峰路33号3楼衣洲服饰有限公司' },
          { id: 5, factoryName: '万邦服装', alias: '衣洲有限服饰', status: '已启用', contacts: '张无忌', phone: '13011053225', address: '浙江省宁波市奉化区恒峰路33号3楼衣洲服饰有限公司' }
        ]
        this.tableLoading = false;
      }, 500);

    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },

    // 添加工厂-弹框 查询
    handleAddFactorySearch() {
      if (!this.AddFactoryDialog.Search.trim()) {
        return this.$message.error('请输入工厂名称')
      }

      this.AddFactoryDialog.tableLoading = true;
      setTimeout(() => {
        this.AddFactoryDialog.TableList = [
          { id: 1, FactoryName: "绍兴市蓝思服饰科技有限公司", status: "添加", Name: "无极", Phone: "13011053225" },
          { id: 2, FactoryName: "绍兴市蓝思服饰科技有限公司", status: "添加", Name: "无极", Phone: "13011053225" },
          { id: 3, FactoryName: "绍兴市蓝思服饰科技有限公司", status: "添加", Name: "无极", Phone: "13011053225" },
          { id: 4, FactoryName: "绍兴市蓝思服饰科技有限公司", status: "添加", Name: "无极", Phone: "13011053225" },
          { id: 5, FactoryName: "绍兴市蓝思服饰科技有限公司", status: "添加", Name: "无极", Phone: "13011053225" }
        ]
        this.AddFactoryDialog.tableLoading = false;
      }, 500);


    },
    // 添加工厂-弹框 点击添加按钮事件
    handleAddFactory(row) {
      row.status = "已添加"
    },
    // 添加工厂-弹框 关闭弹框 
    closeAddFactoryDialog() {
      this.AddFactoryDialog.TableList = [];
      this.AddFactoryDialog.Search = "";
      // 获取数据
      this.initData();
    },

    // 申请工厂-提交事件
    handleSubmitApplyFactory(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.submitLoading = false;
            this.ApplyFactoryDialog.visible = false;
            this.$message.success('添加成功')
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 申请工厂-关闭弹框
    closeApplyFactoryDialog() {
      this.$refs.ApplyFactoryRef.resetFields();
    },

    // 设置费用
    setCosts(row) {
      this.$router.push({ name: "FactoryCosts", query: { id: row.id } })
    },

    // 设置别名-打开弹框
    setAlias(row) {
      this.aliasDialog.aliasForm.name = row.alias;
      this.aliasDialog.visible = true
    },
    // 设置别名-提交按钮事件
    submitAlias(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.submitLoading = false;
            this.aliasDialog.visible = false;
            this.$message.success('设置成功')
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 设置别名-关闭弹框
    closeAliasDialog() {
      this.$refs.aliasRef.resetFields();
    },

    // 删除
    handleDel(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功');
        this.initData()
      }).catch(() => { });
    },

  }
}
</script>

<style lang="scss" scoped>
// 添加工厂弹框
.AddFactorySearch {
  width: 300px;
  margin-bottom: 15px;
}
</style>