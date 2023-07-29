<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" @click="addBrand" icon="el-icon-plus">添加品牌</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+15" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="品牌" show-overflow-tooltip prop="Brand" />
          <el-table-column label="面料商" show-overflow-tooltip prop="FabricMerchant" />
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <el-tag :type="row.Status | statusFilter">{{row.Status}}</el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button icon="el-icon-remove" type="danger" @click="handleDisabled(row,true)" v-if="row.Status=='已启用'">停用</el-button>
              <el-button icon="el-icon-circle-plus" type="success" @click="handleDisabled(row,false)" v-else>启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 新增编辑 弹框 -->
    <el-dialog :title="brandDialog.title" :visible.sync="brandDialog.visible" width="450px" @closed="closeBrandDialog">
      <el-form :model="brandDialog.Form" :rules="brandDialog.Rules" ref="brandRef" label-width="80px">
        <el-form-item label="品牌" prop="brand">
          <el-input maxlength="30" clearable placeholder="输入品牌名称" v-model="brandDialog.Form.brand"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="brandDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitBrand('brandRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BrandManagement',
  data() {
    return {
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
      // 新增编辑弹框相关
      brandDialog: {
        visible: false,
        title: "",
        Form: {
          id: 0,
          brand: "",
        },
        Rules: {
          brand: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入品牌名称', trigger: 'blur' }
          ],
        },
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "已启用": 'success',
        "已停用": 'danger',
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
          { id: 1, Brand: "啄木鸟", FabricMerchant: "面料商1", Status: "已启用" },
          { id: 2, Brand: "耐克", FabricMerchant: "面料商2", Status: "已停用" },
          { id: 3, Brand: "乔丹", FabricMerchant: "面料商3", Status: "已启用" },
        ]
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },

    // 弹框-新增按钮，打开弹框
    addBrand() {
      this.brandDialog.title = "新增品牌";
      this.brandDialog.visible = true;
    },
    // 弹框- 编辑
    handleEdit(row) {
      this.brandDialog.Form.id = row.id
      this.brandDialog.Form.brand = row.Brand

      this.brandDialog.title = "编辑品牌";
      this.brandDialog.visible = true;
    },
    // 弹框-提交按钮
    submitBrand(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.submitLoading = false;
            this.brandDialog.visible = false;
            this.$message.success('操作成功')
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },

    // 弹框-关闭新增编辑弹框
    closeBrandDialog() {
      this.$refs.brandRef.resetFields();

      this.brandDialog.Form = {
        id: 0,
        brand: "",
      }
    },

    // 停用 启用  true(需要停用)  false(需要启用)
    handleDisabled(row, flag) {
      row.Status = flag ? "已停用" : "已启用"
    }
  }
}
</script>

<style lang="scss" scoped>
</style>