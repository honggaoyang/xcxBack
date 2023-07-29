<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="面料商" prop="name">
            <el-input v-model="searchForm.name" clearable placeholder="输入面料商" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item label="面料品牌" prop="brand">
            <el-input v-model="searchForm.brand" clearable placeholder="输入面料品牌" @keyup.enter.native="initData"></el-input>
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
          <el-button type="primary" @click="AddFabricSupplierDialog.visible=true" icon="el-icon-plus">添加面料商</el-button>
          <el-button type="warning" @click="ApplyFabricSupplierDialog.visible=true" icon="el-icon-edit-outline">申请面料商</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="面料商" min-width="100" show-overflow-tooltip prop="FabricMerchant" />
          <el-table-column label="在用品牌" min-width="200">
            <template slot-scope="{row}">
              <div class="brand_wrap">
                <el-tag closable @close="handleCloseTag(index, row)" v-for="(item,index) in row.brand" :key="index">{{item}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="显示别名" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="状态" min-width="100">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="联系人" min-width="100" prop="contacts" show-overflow-tooltip />
          <el-table-column label="联系电话" min-width="110" prop="phone" />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="350">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="primary" @click="setBrand(row)">管理面料品牌</el-button>
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

    <!-- 添加面料商 弹框 -->
    <el-dialog title="添加面料商" :visible.sync="AddFabricSupplierDialog.visible" width="850px" @closed="closeAddFabricSupplierDialog">
      <div>
        <!-- 搜索框 -->
        <div class="AddFabricSupplierSearch">
          <el-input placeholder="输入面料商名称" @keyup.enter.native="handleAddFabricSupplierSearch" clearable v-model="AddFabricSupplierDialog.Search">
            <el-button type="primary" slot="append" icon="el-icon-search" @click="handleAddFabricSupplierSearch"></el-button>
          </el-input>
        </div>
        <!-- 表格 -->
        <el-table v-loading="AddFabricSupplierDialog.tableLoading" height="350px" class="hhy-table" :data="AddFabricSupplierDialog.TableList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}">
          <el-table-column type="index" label="序号" />
          <el-table-column label="面料商" min-width="100" show-overflow-tooltip prop="FabricSupplier" />
          <el-table-column label="联系人" min-width="100" prop="Name" show-overflow-tooltip />
          <el-table-column label="联系电话" min-width="110" prop="Phone" />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="{row}">
              <el-button v-if="row.status=='添加'" icon="el-icon-plus" type="primary" @click="handleAddFabricSupplier(row)">添加</el-button>
              <el-button v-else disabled type="primary">已添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 申请面料商 弹框 -->
    <el-dialog title="申请平台添加面料商" :visible.sync="ApplyFabricSupplierDialog.visible" width="450px" @closed="closeApplyFabricSupplierDialog">
      <el-form :model="ApplyFabricSupplierDialog.Form" :rules="ApplyFabricSupplierDialog.ApplyFabricSupplierRules" ref="ApplyFabricSupplierRef" label-width="80px">
        <el-form-item label="面料商" prop="FabricSupplier">
          <el-input maxlength="30" clearable placeholder="输入面料商" v-model="ApplyFabricSupplierDialog.Form.FabricSupplier"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="Name">
          <el-input maxlength="10" clearable placeholder="输入面料商联系人" v-model="ApplyFabricSupplierDialog.Form.Name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="Phone">
          <el-input maxlength="11" clearable placeholder="输入面料商联系电话" oninput="value=value.replace(/[^\d]/g,'')" v-model="ApplyFabricSupplierDialog.Form.Phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ApplyFabricSupplierDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitApplyFabricSupplier('ApplyFabricSupplierRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 管理面料品牌 弹框 -->
    <el-dialog title="面料品牌" :visible.sync="brandDialog.visible" width="850px" @closed="closeBrandDialog">
      <div class="brandDialog_wrap">
        <div>
          <!-- 搜索框 -->
          <div class="brandSearch">
            <el-input placeholder="请输入面料品牌" @keyup.enter.native="handleBrandSeach" clearable v-model="brandDialog.Search">
              <el-button type="primary" slot="append" icon="el-icon-search" @click="handleBrandSeach"></el-button>
            </el-input>
          </div>
          <!-- 表格 -->
          <el-table v-loading="brandDialog.tableLoading" height="350px" class="hhy-table" :data="brandDialog.TableList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
            <el-table-column type="index" label="序号" />
            <el-table-column label="品牌" min-width="100" show-overflow-tooltip prop="brand" />
            <el-table-column label="状态" min-width="100">
              <template slot-scope="{row}">
                <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="{row}">
                <el-button v-if="row.btnStaus=='添加'" :loading="submitLoading" icon="el-icon-plus" type="primary" @click="handleBrandAdd(row)">添加</el-button>
                <el-button v-else disabled type="primary">已添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 已添加品牌 -->
        <div>
          <el-card class="box-card">
            <div slot="header">
              <span>已添加品牌</span>
            </div>
            <p v-for="(item,index) in brandDialog.selBrand" :key="index">
              <el-tag closable @close="removeSelBrand(index, brandDialog.selBrand)">
                {{item}}
              </el-tag>
            </p>
          </el-card>
        </div>
      </div>
    </el-dialog>

    <!-- 设置别名 弹框 -->
    <el-dialog title="面料商别名" :visible.sync="aliasDialog.visible" width="450px" @closed="closeAliasDialog">
      <el-form :model="aliasDialog.aliasForm" :rules="aliasDialog.aliasRules" ref="aliasRef" label-width="80px">
        <el-form-item label="显示别名" prop="name">
          <el-input maxlength="30" clearable placeholder="输入面料商别名" v-model="aliasDialog.aliasForm.name"></el-input>
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
  name: 'FabricSupplier',
  data() {
    return {
      searchForm: {
        name: "",
        brand: "",
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

      // 添加面料商 弹框相关
      AddFabricSupplierDialog: {
        visible: false, // 添加面料商-弹框
        Search: "", // 添加面料商-弹框搜索内容
        tableLoading: false, // 添加面料商- 表格加载状态
        TableList: [], // 添加面料商-弹框表格数据
      },

      // 申请面料商 弹框相关
      ApplyFabricSupplierDialog: {
        visible: false,//申请面料商弹框
        // 申请面料商表单
        Form: {
          FabricSupplier: "",
          Name: "",
          Phone: "",
        },
        // 申请面料商验证规则
        ApplyFabricSupplierRules: {
          FabricSupplier: [
            { required: true, message: '请输入面料商', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入面料商', trigger: 'blur' }
          ],
          Name: [
            { required: true, message: '请输入面料商联系人', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入面料商联系人', trigger: 'blur' }
          ],
          Phone: [
            { required: true, message: '请输入面料商联系电话', trigger: 'blur' },
            { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
        },
      },

      // 管理面料品牌 弹框相关
      brandDialog: {
        visible: false,
        Search: "",
        tableLoading: false, // 添加品牌- 表格加载状态
        TableList: [], // 添加品牌-弹框表格数据
        selBrand: [], // 当前已选择的品牌
      },

      // 设置别名 弹框相关
      aliasDialog: {
        visible: false,
        aliasForm: {
          name: "",
        },
        aliasRules: {
          name: [
            { required: true, message: '请输入面料商别名', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入面料商别名', trigger: 'blur' }
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
          { id: 1, FabricMerchant: '耐克面料', brand: ['面料品牌1', '面料品牌2'], alias: '面料', status: '已启用', contacts: '张无忌', phone: '13011053225' },
          { id: 2, FabricMerchant: '耐克工厂', brand: ['面料品牌2'], alias: '', status: '已启用', contacts: '张无忌', phone: '13011053225' },
          { id: 3, FabricMerchant: '耐克仓库', brand: ['面料品牌3'], alias: '面料', status: '已禁用', contacts: '张无忌', phone: '13011053225' }
        ]
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 关闭tag标签
    handleCloseTag(tagIndex, row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.brand.splice(tagIndex, 1)
        this.$message.success('删除成功');
        this.initData();
      }).catch(() => { });
    },
    // 添加面料商-弹框 查询
    handleAddFabricSupplierSearch() {
      if (!this.AddFabricSupplierDialog.Search.trim()) {
        return this.$message.error('请输入面料商名')
      }
      this.AddFabricSupplierDialog.tableLoading = true;
      setTimeout(() => {
        this.AddFabricSupplierDialog.TableList = [
          { id: 1, FabricSupplier: "李宁面料", status: "添加", Name: "无极", Phone: "13011053225" },
          { id: 2, FabricSupplier: "李宁面料", status: "添加", Name: "无极", Phone: "13011053225" },
          { id: 3, FabricSupplier: "李宁面料", status: "添加", Name: "无极", Phone: "13011053225" },
          { id: 4, FabricSupplier: "李宁面料", status: "添加", Name: "无极", Phone: "13011053225" },
          { id: 5, FabricSupplier: "李宁面料", status: "添加", Name: "无极", Phone: "13011053225" },
          { id: 6, FabricSupplier: "李宁面料", status: "添加", Name: "无极", Phone: "13011053225" },
        ]
        this.AddFabricSupplierDialog.tableLoading = false;
      }, 500);


    },
    // 添加面料商-弹框 点击添加按钮事件
    handleAddFabricSupplier(row) {
      row.status = "已添加"
    },
    // 添加面料商-弹框 关闭弹框 
    closeAddFabricSupplierDialog() {
      this.AddFabricSupplierDialog.TableList = [];
      this.AddFabricSupplierDialog.Search = "";
      // 获取数据
      this.initData();
    },

    // 申请面料商-提交事件
    handleSubmitApplyFabricSupplier(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.submitLoading = false;
            this.ApplyFabricSupplierDialog.visible = false;
            this.$message.success('添加成功')
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 申请面料商-关闭弹框
    closeApplyFabricSupplierDialog() {
      this.$refs.ApplyFabricSupplierRef.resetFields();
    },

    // 管理面料品牌-打开弹框
    setBrand(row) {
      this.brandDialog.selBrand = row.brand;

      this.brandDialog.visible = true; // 打开弹框
      this.brandDialog.tableLoading = true;

      setTimeout(() => {
        this.brandDialog.TableList = [
          { id: 1, brand: '面料品牌1', status: '已启用', btnStaus: '添加' },
          { id: 2, brand: '面料品牌2', status: '已启用', btnStaus: '添加' },
          { id: 3, brand: '面料品牌3', status: '已启用', btnStaus: '添加' },
          { id: 4, brand: '面料品牌4', status: '已启用', btnStaus: '添加' },
          { id: 5, brand: '面料品牌5', status: '已启用', btnStaus: '添加' },
          { id: 6, brand: '面料品牌6', status: '已启用', btnStaus: '添加' }
        ]
        this.brandDialog.TableList.forEach(v => {
          v.btnStaus = row.brand.includes(v.brand) ? "已添加" : "添加"
        })
        this.brandDialog.tableLoading = false;
      }, 500);


    },
    // 管理面料品牌-查询
    handleBrandSeach() {

    },
    // 管理面料品牌-添加
    handleBrandAdd(row) {
      this.submitLoading = true;
      setTimeout(() => {
        this.submitLoading = false;
        row.btnStaus = "已添加";
        this.brandDialog.selBrand.push(row.brand);
      }, 500);

    },
    // 管理面料品牌-移除选中的品牌
    removeSelBrand(index, list) {
      list.splice(index, 1)
      this.brandDialog.TableList.forEach(v => {
        v.btnStaus = this.brandDialog.selBrand.includes(v.brand) ? "已添加" : "添加"
      })
    },
    // 管理面料品牌-关闭弹框
    closeBrandDialog() {
      this.brandDialog.TableList = [];
      this.brandDialog.selBrand = [];
      // this.initData();
    },

    // 设置别名-打开弹框
    setAlias(row) {
      this.aliasDialog.aliasForm.name = row.alias
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
        this.initData();
      }).catch(() => { });
    },
  }
}
</script>

<style lang="scss" scoped>
.hhy-table {
  .brand_wrap {
    .el-tag {
      margin-top: 5px;
      margin-right: 5px;
      &:nth-child(1) {
        margin-top: 0;
      }
    }
  }
}

// 添加面料商弹框
.AddFabricSupplierSearch {
  width: 300px;
  margin-bottom: 15px;
}

// 设置品牌商弹框
.brandDialog_wrap {
  display: flex;
  flex-direction: row-reverse;
  gap: 15px;
  > div {
    &:nth-child(1) {
      flex: 3;
      .brandSearch {
        width: 50%;
        margin-bottom: 15px;
      }
    }
    &:nth-child(2) {
      flex: 2;
      .box-card {
        height: 100%;
        font-size: 16px;
        p {
          &:nth-child(1) {
            margin-top: 0;
          }
          &:nth-last-child(1) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>