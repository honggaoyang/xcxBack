<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <div class="hhy-tips">
            <p>{{productName}} - 工艺参数</p>
          </div>
          <el-button type="primary" @click="handleAddProcess" icon="el-icon-plus">添加</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table dragTable" row-key="id" :height="slotProps.contentHeight+30" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="类型" prop="type"></el-table-column>
          <el-table-column label="成本" prop="cost"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="warning" @click="handleEditProcess(row)">编辑</el-button>
              <el-button icon="el-icon-search" type="primary" @click="handleProcessOption(row)">浏览选项</el-button>
              <el-button v-if="row.status=='已禁用'" icon="el-icon-turn-off" type="success" @click="handleEnable(row)">启用</el-button>
              <el-button v-if="row.status=='已启用'" icon="el-icon-open" type="danger" @click="handleDisable(row)">禁用</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </template>
    </PageWrap>
    <!-- 新增编辑工艺弹框  -->
    <el-dialog :title="editProcessDialog.title" top="8vh" :visible.sync="editProcessDialog.visible" width="550px" @closed="closeEditProcessDialog">
      <el-form ref="editProcessRef" class="editProcessDialog" :model="editProcessDialog.Form" :inline="false" :rules="editProcessDialog.Rules" label-width="80px">
        <el-form-item label="定制产品">
          {{productName}}
        </el-form-item>
        <el-form-item label="工艺名称" prop="technologyName">
          <el-input maxlength="30" v-model="editProcessDialog.Form.technologyName" clearable placeholder="输入工艺名"></el-input>
        </el-form-item>
        <el-form-item label="选项类型" prop="optionType">
          <el-radio-group v-model="editProcessDialog.Form.optionType">
            <el-radio v-for="i in editProcessDialog.optionTypeList" :key="i.id" :label="i.id">{{i.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="制作工费" prop="costs">
          <el-input maxlength="8" v-model="editProcessDialog.Form.costs" placeholder="输入制作工费" clearable oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer">
        <el-button @click="editProcessDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitEditProcess('editProcessRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: "processParams",
  data() {
    return {
      submitLoading: false,
      productName: "",
      ID: "",
      tableLoading: false,
      tableDataList: [],
      // 新增编辑工艺弹框
      editProcessDialog: {
        title: "",
        visible: false,
        optionTypeList: [{ id: 1, name: '单行输入' }, { id: 2, name: '多行输入' }, { id: 3, name: '单选' }, { id: 4, name: '多选' }],
        Form: {
          technologyName: "",
          optionType: 3,
          costs: "",
        },
        Rules: {
          technologyName: [
            { required: true, message: '请输入工艺名称', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入工艺名称', trigger: 'blur' }
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
    const id = this.$route.params && this.$route.params.id
    this.productName = this.$route.query.name;
    this.ID = id;
    this.$message.success(`当前ID为${id}`)

    // 初始化数据
    this.initData()
  },
  methods: {
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { id: 1, name: '制作工艺', type: "单选", cost: '-', status: '已启用', createTime: '2023-11-12 12:12:12' },
          { id: 2, name: '领型', type: "单选", cost: '-', status: '已禁用', createTime: '2023-11-12 12:12:12' },
        ];
        this.tableLoading = false;

        this.$nextTick(() => {
          this.setSort()
        })
      }, 500);
    },
    // 表格拖拽排序
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]

      const sortable = new Sortable(el, {
        ghostClass: 'sortable-ghost', // 放置占位符的类名，
        setData: function (dataTransfer) {
          // 以避免Firefox错误
          // 详见 : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tableDataList.splice(evt.oldIndex, 1)[0]
          this.tableDataList.splice(evt.newIndex, 0, targetRow)

          // 请求排序接口
        }
      })
    },
    // 新增工艺
    handleAddProcess() {
      this.editProcessDialog.title = "新增定制工艺"
      this.editProcessDialog.visible = true;
    },
    // 编辑工艺
    handleEditProcess(row) {
      this.editProcessDialog.title = "编辑定制工艺"
      this.editProcessDialog.Form.technologyName = row.name;
      this.editProcessDialog.visible = true;
    },
    // 编辑工艺弹框点击确定
    handleSubmitEditProcess(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.editProcessDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 关闭编辑工艺弹框
    closeEditProcessDialog() {
      this.$refs['editProcessRef'].resetFields();
      this.editProcessDialog.title = "";
    },
    // 浏览工艺选项
    handleProcessOption(row) {
      this.$router.push(`/CustomizedProducts/processOption?id=${row.id}&name=${row.name}`)
    },
    // 启用
    handleEnable(row) {
      // row.status = "已启用"
      this.$message.success('操作成功')
      this.initData();
    },
    // 禁用
    handleDisable(row) {
      this.$confirm('禁用后，该工艺将不可使用，确认吗?', '提示', {
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
 <style >
.dragTable .sortable-ghost td {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
.dragTable .el-table__body tr:hover > td {
  cursor: move;
}
</style>
<style lang="scss" scoped>
.editProcessDialog {
  .el-input {
    width: 210px;
  }
}
</style>