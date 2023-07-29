<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" @click="AddActivity" icon="el-icon-plus">添加活动</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+15" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="名称" show-overflow-tooltip prop="Name" />

          <el-table-column label="内部链接" show-overflow-tooltip prop="Link" />
          <el-table-column label="是否启用">
            <template slot-scope="{row}">
              <el-tag :type="row.Status | statusFilter">{{row.Status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" show-overflow-tooltip prop="CreateTime" />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="300">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="primary" @click="handleEditActivity(row)">编辑</el-button>
              <el-button icon="el-icon-remove" type="danger" @click="handleDisabled(row)" v-if="row.Status=='已启用'">停用</el-button>
              <el-button icon="el-icon-circle-plus" type="success" @click="handleEnable(row)" v-else>启用</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'EventManagement',
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
          { id: 1, Name: "618活动", Link: "http://www.baidu.com", Status: "已启用", CreateTime: '2026-12-12 12:12:12' },
          { id: 2, Name: "双11活动", Link: "http://www.baidu.com", Status: "已停用", CreateTime: '2026-12-12 12:12:12' },
        ]
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },

    // 添加活动
    AddActivity() {
      this.$router.push({ name: 'AddEvent' })
    },

    // 编辑活动
    handleEditActivity(row) {
      this.$router.push({ name: 'EditEvent', params: { id: row.id } })
    },

    // 禁用
    handleDisabled(row) {
      this.$confirm('确定要停用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('操作成功');
        this.initData();
      }).catch(() => { });
    },
    // 启用
    handleEnable(row) {
      this.$message.success('操作成功');
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