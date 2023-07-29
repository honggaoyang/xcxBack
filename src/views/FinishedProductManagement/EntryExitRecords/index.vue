<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="货号" prop="artNo">
            <el-input v-model="searchForm.artNo" clearable placeholder="货号" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="initData" type="primary" class="hhy-search-btn" round>查询</el-button>
            <el-button @click="resetSearchForm('searchForm')" type="danger" class="hhy-reset-btn" round>重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
          <el-table-column label="操作流水号" min-width="180" show-overflow-tooltip prop="serialNo"></el-table-column>
          <el-table-column label="成品" min-width="130" show-overflow-tooltip prop="finishProduct"></el-table-column>
          <el-table-column label="规格" min-width="100">
            <template slot-scope="{row}">
              <el-tag type="primary">{{row.color}} {{row.size}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="货号" min-width="100">
            <template slot-scope="{row}">
              {{row.artNo}}
            </template>
          </el-table-column>
          <el-table-column label="操作来源" min-width="100" prop="source"></el-table-column>
          <el-table-column label="数量调整" min-width="100">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}：{{row.number}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作时间" prop="date" min-width="150" />
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
  name: "EntryExitRecords",
  data() {
    return {
      searchForm: {
        artNo: "", // 货号
      },
      tableLoading: false, // table 加载状态
      tableDataList: [],
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },
    }
  },
  activated() {
    this.watchQuery();
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "出库": 'success',
        "入库": 'warning',
      }
      return statusMap[status]
    }
  },
  created() {
    this.watchQuery();
    // 初始化数据
    this.initData()
  },
  methods: {
    // 监听路由参数变化重新请求接口
    watchQuery() {
      let artNo = this.searchForm.artNo; // 表单值
      let query = this.$route.query.artNo; // 参数

      // 如果参数有值，并且不等于表单的值，吧参数赋值给搜索表单，重新请求接口
      if (query && query != artNo) {
        this.searchForm.artNo = query;
        this.initData();
      }
    },
    // 重置查询表单
    resetSearchForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { id: 1, serialNo: "1675069509221756928", finishProduct: "POLO衫经典款", color: "黄色", size: 31, artNo: "jdk01-01", source: "门店采购", status: "出库", number: 1, date: "2023-07-01 17:11:12" },
          { id: 2, serialNo: "1675069509221756928", finishProduct: "领结", color: "黄色", size: '', artNo: "jdk01-02", source: "平台调拨", status: "出库", number: 1, date: "2023-07-01 17:11:12" },
          { id: 3, serialNo: "1675069509221756928", finishProduct: "POLO衫经典款", color: "黄色", size: 31, artNo: "jdk01-03", source: "人工操作", status: "入库", number: 2, date: "2023-07-01 17:11:12" }
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
  }
}
</script>

<style>
</style>