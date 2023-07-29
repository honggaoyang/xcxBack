<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="标题" prop="title">
            <el-input v-model="searchForm.title" clearable placeholder="输入文章标题" @keyup.enter.native="initData"></el-input>
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
          <el-button type="primary" @click="AddArt" icon="el-icon-plus">添加</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="标题" min-width="100" prop="title" show-overflow-tooltip />
          <el-table-column label="创建时间" min-width="100" prop="createTime" show-overflow-tooltip />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="350">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="primary" @click="handleEditArt(row)">编辑</el-button>
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
  </div>
</template>

<script>
export default {
  name: "Article",
  data() {
    return {
      ID: '', // 主题ID
      Name: "", // 主题名称
      searchForm: {
        title: "",
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
    }
  },
  created() {

    const ID = this.$route.params && this.$route.params.id
    const Name = this.$route.params && this.$route.params.name
    this.$message.success(`当前ID为${ID}`)
    this.Name = Name;
    this.ID = ID;

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
          { id: 1, title: '618活动', createTime: '2026-12-12 12:12:12' },
          { id: 2, title: '618活动2', createTime: '2026-12-12 12:12:12' },
        ]
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 添加文章
    AddArt() {
      this.$router.push({ name: 'AddArticle', params: { ArtID: this.ID, name: this.Name } })
    },
    // 编辑文章
    handleEditArt(row) {
      this.$router.push({ name: 'EditArticle', params: { ArtID: this.ID, id: row.id, name: this.Name } })
    },
    // 删除文章
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

<style>
</style>