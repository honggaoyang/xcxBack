<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="采购单" prop="PurchaseOrder">
            <el-input v-model="searchForm.PurchaseOrder" clearable placeholder="采购单" @keyup.enter.native="initData"></el-input>
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
          <el-table-column label="订单" min-width="180" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-tag>{{row.store}}</el-tag>
              <div>{{row.order}}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单商品" min-width="120" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-link @click="openShippedDetail(row)" type="primary">{{row.orderNumber}}件商品</el-link>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="120">
            <template slot-scope="{row}">
              <el-tag type="success">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发货时间" min-width="150" prop="deliveryTime" />
          <el-table-column label="发货仓" min-width="120" prop="shippingWarehouse" show-overflow-tooltip />
          <el-table-column label="物流" min-width="200">
            <template slot-scope="{row}">
              <div>{{row.logistics}}</div>
              <el-link target="_blank" :href="'https://www.baidu.com/s?wd='+row.logisticsNo" type="primary">单号：{{row.logisticsNo}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="收货入库" min-width="200">
            <template slot-scope="{row}">
              <div>收货人：{{row.consignee}}</div>
              <div>时间：{{row.date}}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="{row}">
              <el-button icon="el-icon-box" type="success" @click="Warehousing(row)">收货入库</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 查看发货详情  -->
    <el-dialog title="查看发货详情" top="8vh" :visible.sync="searchShippedDialog.visible" width="65%" @closed="closeSearchShippedDialog">
      <el-table class="hhy-table" v-loading="searchShippedDialog.tableLoading" element-loading-text="加载中..." height="400" :data="searchShippedDialog.tableData" stripe :header-cell-style="{textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column label="采购商品" show-overflow-tooltip prop="productName" />
        <el-table-column label="规格" show-overflow-tooltip prop="specifications" />
        <el-table-column label="货号" show-overflow-tooltip prop="ardNo" />
        <el-table-column label="采购价" prop="purchasePrice" />
        <el-table-column label="采购数量" prop="purchaseNumber" />
        <el-table-column label="发货数量" prop="shipmentQuantity" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ReceivingRecords",
  data() {
    return {
      searchForm: {
        PurchaseOrder: "", // 采购单
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
      // 查看发货相关
      searchShippedDialog: {
        visible: false,
        tableData: [],
        tableLoading: false,
      }
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
          { id: 1, order: "1675069509221756928", store: "北京店", orderNumber: 1, status: "已完成", deliveryTime: '2023-11-12 12:12:12', shippingWarehouse: "天津仓库", logistics: "京东物流", logisticsNo: 'JDKA00299843173', consignee: '张无忌', date: "2023-07-01 17:11:12" },
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 查看发货详情
    openShippedDetail(row) {
      this.searchShippedDialog.visible = true
      this.searchShippedDialog.tableLoading = true
      setTimeout(() => {
        this.searchShippedDialog.tableData = [
          { id: 1, productName: "POLO衫经典款", specifications: "黄色 41", ardNo: 'jdk01-01', purchasePrice: 99.88, purchaseNumber: 1, shipmentQuantity: 1 },
        ]
        this.searchShippedDialog.tableLoading = false

      }, 500);
    },
    // 关闭 发货详情弹框
    closeSearchShippedDialog() {
      this.searchShippedDialog.tableData = []
    },
    // 收货入库
    Warehousing(row) {
      this.$confirm('确认收到货物了吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('收货成功');
        this.initData()
      }).catch(() => { });
    },
  }
}
</script>

<style>
</style>