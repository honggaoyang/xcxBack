<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" @click="AddTheme" icon="el-icon-plus">添加</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+15" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="名称" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-link @click="toArticlePage(row.id,row.Name)" type="primary">{{row.Name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" show-overflow-tooltip prop="CreateTime" />
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="primary" @click="handleEditTheme(row)">编辑</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row,false)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 新增编辑内容主题弹框 -->
    <el-dialog :title="ThemeDialog.title" :visible.sync="ThemeDialog.visible" width="550px" @closed="closeThemeDialog">
      <el-form :model="ThemeDialog.Form" :rules="ThemeDialog.Rules" ref="ThemeDialogRef" label-width="80px">
        <el-form-item label="主题" prop="Name">
          <el-input maxlength="50" clearable placeholder="输入主题名称" v-model="ThemeDialog.Form.Name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ThemeDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitTheme('ThemeDialogRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ContentManagement',
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

      // 新增编辑主题弹框
      ThemeDialog: {
        title: '',
        visible: false,
        Form: {
          Name: '',
        },
        Rules: {
          Name: [
            { required: true, message: '请输入主题名称', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入主题名称', trigger: 'blur' }
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
          { id: 1, Name: "一“明”惊人", CreateTime: "2025-12-12 12:12:12" },
          { id: 2, Name: "“咳”不容缓", CreateTime: "2025-12-12 12:12:12" },
        ]
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },


    // 新增编辑主题弹框 打开(新增)
    AddTheme() {
      this.ThemeDialog.title = '添加内容主题'
      this.ThemeDialog.visible = true;
    },

    // 新增编辑主题弹框 打开(编辑)
    handleEditTheme(row) {
      this.ThemeDialog.title = '编辑内容主题'
      this.ThemeDialog.visible = true;

      this.ThemeDialog.Form = {
        Name: row.Name,
      }
    },
    // 新增编辑主题弹框 点击确定按钮
    submitTheme(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.submitLoading = false;
            this.ThemeDialog.visible = false;
            this.$message.success('操作成功')
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 新增编辑主题弹框 关闭
    closeThemeDialog() {
      this.$refs.ThemeDialogRef.resetFields();

      this.ThemeDialog.Form = {
        Name: '',
      }
    },

    // 跳转文章列表页面
    toArticlePage(id, name) {
      this.$router.push({ name: 'Article', params: { id, name } })
    },

    // 删除
    handleDelete(row) {
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
</style>