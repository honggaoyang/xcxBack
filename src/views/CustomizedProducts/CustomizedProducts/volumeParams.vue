<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <div class="hhy-tips">
            <p>{{productName}} - 量体参数</p>
          </div>
        </div>
      </template>

      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table dragTable" row-key="id" :height="slotProps.contentHeight+30" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="名称" prop="name" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="别称" prop="alias" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="图片" prop="image" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="手工输入" prop="manualInput" min-width="120"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="200" show-overflow-tooltip></el-table-column>
          <!-- fixed="right" -->
          <el-table-column label="操作" width="200">
            <template slot-scope="{row}">
              <el-button icon="el-icon-setting" type="primary" @click="handleSetAlias(row)">设置别名</el-button>
              <el-button v-if="row.status=='已禁用'" icon="el-icon-turn-off" type="success" @click="handleEnable(row)">启用</el-button>
              <el-button v-if="row.status=='已启用'" icon="el-icon-open" type="danger" @click="handleDisable(row)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageWrap>

    <!-- 设置别名  -->
    <el-dialog title="设置别名" :visible.sync="SetAliasDialog.visible" width="350px" @closed="closeSetAliasDialog">
      <el-form ref="SetAliasDialogRef" class="SetAliasDialog" :model="SetAliasDialog.Form" :inline="false" :rules="SetAliasDialog.Rules" label-width="80px">
        <el-form-item label="量体参数">
          {{SetAliasDialog.Form.VolumeParams}}
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input maxlength="30" v-model="SetAliasDialog.Form.alias" clearable placeholder="请输入别名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="SetAliasDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitSetAlias('SetAliasDialogRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: "volumeParams",
  data() {
    return {
      submitLoading: false,
      productName: "",
      ID: "",
      tableLoading: false,
      tableDataList: [],
      // 设置别名弹框
      SetAliasDialog: {
        visible: false,
        Form: {
          VolumeParams: "",
          alias: "",
        },
        Rules: {
          alias: [
            { required: true, message: '请输入别名', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入别名', trigger: 'blur' }
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
          { id: 1, name: '领围', alias: '领围', image: '无', manualInput: '是', status: '已启用', createTime: '2023-11-12 12:12:12' },
          { id: 2, name: '肩宽', alias: '肩宽', image: '无', manualInput: '', status: '已禁用', createTime: '2023-11-12 12:12:12' },
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
    // 打开设置别名 
    handleSetAlias(row) {
      this.SetAliasDialog.visible = true;
      this.SetAliasDialog.Form.VolumeParams = row.name;
    },
    // 设置别名弹框点击确定
    handleSubmitSetAlias(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.SetAliasDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 关闭设置别名弹框
    closeSetAliasDialog() {
      this.$refs['SetAliasDialogRef'].resetFields();
    },
    // 启用
    handleEnable(row) {
      // row.status = "已启用"
      this.$message.success('操作成功')
      this.initData();
    },
    // 禁用
    handleDisable(row) {
      this.$confirm('停用后，该工艺将不可使用，确认吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.status = "已禁用"
        this.$message.success('操作成功')
        this.initData();
      }).catch(() => { });
    },
  },
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