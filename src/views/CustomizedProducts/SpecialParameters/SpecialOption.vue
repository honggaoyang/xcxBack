<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <div class="hhy-tips">
            <p>{{Name}} - 特体参数选项</p>
          </div>

          <el-button type="" @click="$router.go(-1)" icon="el-icon-back">返回</el-button>
          <el-button type="primary" @click="handleAddSpecialOption" icon="el-icon-plus">添加</el-button>
        </div>
      </template>

      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+30" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="限定工厂" prop="restrictedFactory"></el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="warning" @click="handleEditSpecialOption(row)">编辑</el-button>
              <el-button v-if="row.status=='已禁用'" icon="el-icon-turn-off" type="success" @click="handleEnable(row)">启用</el-button>
              <el-button v-if="row.status=='已启用'" icon="el-icon-open" type="danger" @click="handleDisable(row)">禁用</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageWrap>

    <!-- 新增编辑特体参数弹框  -->
    <el-dialog :title="editSpecialOptionDialog.title" :visible.sync="editSpecialOptionDialog.visible" width="400px" @closed="closeEditSpecialOptionDialog">
      <el-form ref="editSpecialOptionRef" :model="editSpecialOptionDialog.Form" :inline="false" :rules="editSpecialOptionDialog.Rules" label-width="50px">
        <el-form-item label="选项" prop="option">
          <el-input maxlength="30" v-model="editSpecialOptionDialog.Form.option" clearable placeholder="请输入选项"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editSpecialOptionDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitSpecialOption('editSpecialOptionRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      ID: "",
      Name: "",
      submitLoading: false,
      tableLoading: false,
      tableDataList: [],
      // 新增编辑特体参数
      editSpecialOptionDialog: {
        title: "",
        visible: false,
        Form: {
          option: '',
        },
        Rules: {
          option: [
            { required: true, message: '请输入选项名称', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入选项名称', trigger: 'blur' }
          ],
        },
      },
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
    this.ID = this.$route.query && this.$route.query.id
    this.Name = this.$route.query && this.$route.query.name
    this.$message.success(`当前ID为${this.ID}`)

    // 初始化数据
    this.initData()
  },
  methods: {
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { id: 1, name: '正常', status: '已启用', restrictedFactory: '', createTime: '2023-11-12 12:12:12' },
          { id: 2, name: '轻微挺腹凹腰', status: '已启用', restrictedFactory: '', createTime: '2023-11-12 12:12:12' },
          { id: 3, name: '严重挺腹凹腰', status: '已禁用', restrictedFactory: '', createTime: '2023-11-12 12:12:12' },
        ];
        this.tableLoading = false;
      }, 500);
    },

    // 添加特体参数
    handleAddSpecialOption() {
      this.editSpecialOptionDialog.title = "新增特体参数"
      this.editSpecialOptionDialog.visible = true;
    },
    // 编辑特体参数
    handleEditSpecialOption(row) {
      this.editSpecialOptionDialog.title = "编辑特体参数"
      this.editSpecialOptionDialog.Form.option = row.name;
      this.editSpecialOptionDialog.visible = true;
    },

    // 特体参数 弹框点击确定
    handleSubmitSpecialOption(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.editSpecialOptionDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 关闭特体参数弹框
    closeEditSpecialOptionDialog() {
      this.$refs['editSpecialOptionRef'].resetFields();
      this.editSpecialOptionDialog.title = "";
      this.editSpecialOptionDialog.Form.option = "";
    },


    // 启用
    handleEnable(row) {
      // row.status = "已启用"
      this.$message.success('操作成功')
      this.initData();
    },
    // 禁用
    handleDisable(row) {
      this.$confirm('禁用后，该工艺选项将不可使用，确认吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.status = "已禁用"
        this.$message.success('操作成功')
        this.initData();
      }).catch(() => { });
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        this.initData();
      }).catch(() => { });
    },
  }
}
</script>

<style lang="scss" scoped>
</style>