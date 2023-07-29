<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddSpecialBodyParams">添加</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table dragTable" row-key="id" :height="slotProps.contentHeight+30" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="warning" @click="handleEditSpecialBodyParams(row)">编辑</el-button>
              <el-button icon="el-icon-search" type="primary" @click="handleSeeSpecialOption(row)">浏览选项</el-button>
              <el-button v-if="row.status=='已禁用'" icon="el-icon-turn-off" type="success" @click="handleEnable(row)">启用</el-button>
              <el-button v-if="row.status=='已启用'" icon="el-icon-open" type="danger" @click="handleDisable(row)">禁用</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageWrap>

    <!-- 新增编辑特体参数  -->
    <el-dialog :title="specialBodyDialog.title" :visible.sync="specialBodyDialog.visible" width="550px" @closed="closeSpecialBodyDialog">
      <el-form ref="specialBodyRef" class="specialBodyDialog" :model="specialBodyDialog.Form" :inline="false" :rules="specialBodyDialog.Rules" label-width="80px">
        <el-form-item label="特体参数" prop="Name">
          <el-input maxlength="30" v-model="specialBodyDialog.Form.Name" clearable placeholder="请输入特体参数"></el-input>
        </el-form-item>
        <el-form-item label="选项类型" prop="optionType">
          <el-radio-group v-model="specialBodyDialog.Form.optionType">
            <el-radio v-for="i in specialBodyDialog.optionTypeList" :key="i.id" :label="i.id">{{i.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="specialBodyDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitSpecialBody('specialBodyRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  name: "SpecialParameters",
  data() {
    return {
      submitLoading: false,
      tableLoading: false,
      tableDataList: [],

      //新增编辑 特体参数
      specialBodyDialog: {
        id: "",
        title: "",
        visible: false,
        optionTypeList: [{ id: 1, name: '单行输入' }, { id: 2, name: '多行输入' }, { id: 3, name: '单选' }, { id: 4, name: '多选' }],
        Form: {
          Name: "",
          optionType: 3,
        },
        Rules: {
          Name: [
            { required: true, message: '请输入特体参数', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入特体参数', trigger: 'blur' }
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
    // 初始化数据
    this.initData()
  },
  methods: {
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { id: 1, name: '挺腹凹腰', status: '已启用', createTime: '2023-11-12 12:12:12' },
          { id: 2, name: '左肩型', status: '已启用', createTime: '2023-11-12 12:12:12' },
          { id: 3, name: '肩胛骨', status: '已禁用', createTime: '2023-11-12 12:12:12' },
          { id: 4, name: '人体形态', status: '已禁用', createTime: '2023-11-12 12:12:12' },
          { id: 5, name: '臀型', status: '已启用', createTime: '2023-11-12 12:12:12' },
          { id: 6, name: '胸型', status: '已启用', createTime: '2023-11-12 12:12:12' },
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
    // 特体参数 新增 打开
    handleAddSpecialBodyParams() {
      this.specialBodyDialog.title = "新增特体参数";
      this.specialBodyDialog.visible = true;
    },
    // 特体参数 编辑 打开
    handleEditSpecialBodyParams(row) {
      this.specialBodyDialog.title = "编辑特体参数";
      this.specialBodyDialog.id = row.id;
      this.specialBodyDialog.Form.Name = row.name;
      this.specialBodyDialog.visible = true;
    },
    // 特体参数 点击确定
    handleSubmitSpecialBody(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.specialBodyDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 特体参数 关闭
    closeSpecialBodyDialog() {
      this.$refs['specialBodyRef'].resetFields();
      this.specialBodyDialog.title = "";
      this.specialBodyDialog.Form.Name = "";
    },

    // 浏览选项
    handleSeeSpecialOption(row) {
      this.$router.push(`/CustomizedProducts/SpecialOption?id=${row.id}&name=${row.name}`)
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