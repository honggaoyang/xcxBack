<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="门店" prop="store">
            <el-select v-model="searchForm.store" placeholder="门店">
              <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起止时间" prop="date">
            <el-date-picker style="width:250px" value-format="yyyy-MM-dd" v-model="searchForm.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="单号" prop="orderNumber">
            <el-input v-model="searchForm.orderNumber" clearable placeholder="单号" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="initData" type="primary" class="hhy-search-btn" round>查询</el-button>
            <el-button @click="resetSearchForm('searchForm')" type="danger" class="hhy-reset-btn" round>重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn" style="padding-bottom:5px;">
          <el-tabs v-model="activeMenuName" @tab-click="handleMenuClick">
            <el-tab-pane label="全部" name="全部"></el-tab-pane>
            <el-tab-pane label="等待审批" name="等待审批"></el-tab-pane>
            <el-tab-pane label="驳回" name="驳回"></el-tab-pane>
            <el-tab-pane label="处理中" name="处理中"></el-tab-pane>
            <el-tab-pane label="完成" name="完成"></el-tab-pane>
            <el-tab-pane label="已取消" name="已取消"></el-tab-pane>
          </el-tabs>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 下拉数据 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="sub_table_wrap">
                <el-table :data="props.row.datas" stripe :header-cell-style="headerCellStyle" :cell-style="cellStyle" :row-class-name="rowClassName" border @expand-change="expandChange">
                  <el-table-column prop="applyNo" label="订单商品">
                    <template slot-scope="{row}">
                      <el-link @click="openShippedDetail(row)" type="primary">{{row.orderCount}}件商品</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="orderStatus" label="状态" />
                  <el-table-column prop="sendDate" label="发货时间" />
                  <el-table-column prop="sendWarehouse" label="发货仓" />
                  <el-table-column prop="applyNo" show-overflow-tooltip label="物流">
                    <template slot-scope="{row}">
                      <div>{{row.ems}}</div>
                      <div><el-link target="_blank" :href="'https://www.baidu.com/s?wd='+row.orderNo" type="primary">单号：{{row.orderNo}}</el-link></div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="applyNo" label="收货入库">
                    <template slot-scope="{row}">
                      <div>收货人：{{row.shName}}</div>
                      <div>收货时间：{{row.date}}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
          <el-table-column label="订单" min-width="150" show-overflow-tooltip prop="orderNo"></el-table-column>
          <el-table-column label="门店" min-width="120" show-overflow-tooltip prop="store"></el-table-column>
          <el-table-column label="订单商品" min-width="120">
            <template slot-scope="{row}">
              <el-link @click="openPurchaseDetail(row)" type="primary">共{{row.optionNum}}项</el-link> <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" min-width="120">
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.orderStatus | orderStatusFilter">{{row.orderStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="订单金额" min-width="120" prop="amount"></el-table-column>
          <el-table-column label="发货次数" min-width="120" prop="sendCount"></el-table-column>
          <el-table-column label="创建时间" min-width="150" prop="createDate"></el-table-column>
          <el-table-column label="操作" width="130" fixed="right">
            <template slot-scope="{row}">
              <el-button icon="el-icon-document" type="primary" @click="overOrder(row)">完成订单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 查看采购单 -->
    <el-dialog title="查看采购单" top="8vh" :visible.sync="searchPurchaseOrderDialog.visible" width="65%" @closed="closeSearchPurchaseOrderDialog">
      <el-table class="hhy-table" v-loading="searchPurchaseOrderDialog.tableLoading" element-loading-text="加载中..." height="400" :data="searchPurchaseOrderDialog.tableData" stripe :header-cell-style="{textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column label="采购商品" show-overflow-tooltip prop="productName" />
        <el-table-column label="规格" show-overflow-tooltip prop="specifications" />
        <el-table-column label="货号" show-overflow-tooltip prop="ardNo" />
        <el-table-column label="数量" prop="number" />
        <el-table-column label="可用库存" prop="availableStock" />
        <el-table-column label="已发货" prop="shipped" />
        <el-table-column label="还需发货" prop="needShipped" />
      </el-table>
    </el-dialog>

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
  name: "PurchaseOrder",
  data() {
    return {
      storeList: [{ id: 1, name: '全部' }, { id: 2, name: '北京店' }],
      searchForm: {
        store: 1, // 门店
        date: "", // 起止时间
        orderNumber: "", // 单号 
      },
      activeMenuName: "全部", // 选中菜单
      tableLoading: false, // table 加载状态
      tableDataList: [],
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },
      // 查看采购单相关
      searchPurchaseOrderDialog: {
        visible: false,
        tableData: [],
        tableLoading: false,
      },
      // 查看发货相关
      searchShippedDialog: {
        visible: false,
        tableData: [],
        tableLoading: false,
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "已发完": 'success',
        "未发货": 'danger',
      }
      return statusMap[status]
    },
    orderStatusFilter(status) {
      const statusMap = {
        "等待审批": 'primary',
        "驳回": 'danger',
        "处理中": 'warning',
        "完成": 'success',
        "已取消": 'info',
      }
      return statusMap[status]
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
    // 菜单切换事件
    handleMenuClick(tab, event) {
      this.tableDataList = [];
      this.initData();
    },
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        let DataList = []
        if (this.activeMenuName == '全部') {
          DataList = [
            { id: 1, orderNo: '00059230701161837', store: "北京店", optionNum: 1, status: '已发完', orderStatus: '处理中', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [{ id: 1, orderCount: '6', orderStatus: "已完成", sendDate: "2023-05-05 15:25", sendWarehouse: '邯郸仓库', ems: '京东快递', orderNo: 'JDKA00299843173', shName: '张三疯', date: '2023-07-07' }] },
            { id: 2, orderNo: '00059230701161837', store: "北京店", optionNum: 1, status: '已发完', orderStatus: '等待审批', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [{ id: 1, orderCount: '6', orderStatus: "已完成", sendDate: "2023-05-05 15:25", sendWarehouse: '邯郸仓库', ems: '京东快递', orderNo: 'JDKA00299843173', shName: '张三疯', date: '2023-07-07' }] },
            { id: 3, orderNo: '00059230701161837', store: "北京店", optionNum: 1, status: '未发货', orderStatus: '驳回', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [] },
            { id: 4, orderNo: '00059230701161837', store: "北京店", optionNum: 1, status: '未发货', orderStatus: '完成', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [] },
            { id: 5, orderNo: '00059230701161837', store: "北京店", optionNum: 1, status: '未发货', orderStatus: '已取消', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [] },
          ]
        } else if (this.activeMenuName == '等待审批') {
          DataList = [
            { id: 1, orderNo: '00059230701161837', store: "北京店2", optionNum: 1, status: '已发完', orderStatus: '等待审批', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [{ id: 1, orderCount: '6', orderStatus: "已完成", sendDate: "2023-05-05 15:25", sendWarehouse: '邯郸仓库', ems: '京东快递', orderNo: 'JDKA00299843173', shName: '张三疯', date: '2023-07-07' }] },
          ]
        } else if (this.activeMenuName == '驳回') {
          DataList = [
            { id: 1, orderNo: '00059230701161837', store: "北京店3", optionNum: 1, status: '已发完', orderStatus: '驳回', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [{ id: 1, orderCount: '6', orderStatus: "已完成", sendDate: "2023-05-05 15:25", sendWarehouse: '邯郸仓库', ems: '京东快递', orderNo: 'JDKA00299843173', shName: '张三疯', date: '2023-07-07' }] },
          ]
        } else if (this.activeMenuName == '处理中') {
          DataList = [
            { id: 1, orderNo: '00059230701161837', store: "北京店4", optionNum: 1, status: '已发完', orderStatus: '处理中', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [{ id: 1, orderCount: '6', orderStatus: "已完成", sendDate: "2023-05-05 15:25", sendWarehouse: '邯郸仓库', ems: '京东快递', orderNo: 'JDKA00299843173', shName: '张三疯', date: '2023-07-07' }] },
          ]
        } else if (this.activeMenuName == '完成') {
          DataList = [
            { id: 1, orderNo: '00059230701161837', store: "北京店5", optionNum: 1, status: '已发完', orderStatus: '完成', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [{ id: 1, orderCount: '6', orderStatus: "已完成", sendDate: "2023-05-05 15:25", sendWarehouse: '邯郸仓库', ems: '京东快递', orderNo: 'JDKA00299843173', shName: '张三疯', date: '2023-07-07' }] },
          ]
        } else if (this.activeMenuName == '已取消') {
          DataList = [
            { id: 1, orderNo: '00059230701161837', store: "北京店6", optionNum: 1, status: '已发完', orderStatus: '已取消', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', datas: [{ id: 1, orderCount: '6', orderStatus: "已完成", sendDate: "2023-05-05 15:25", sendWarehouse: '邯郸仓库', ems: '京东快递', orderNo: 'JDKA00299843173', shName: '张三疯', date: '2023-07-07' }] },
          ]
        }

        this.tableDataList = DataList;
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },

    // 设置表头样式
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      return { textAlign: 'center', background: '#607D8B', color: '#FFFFFF' }
    },
    // 设置表内容样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return { textAlign: 'center' }
    },
    // 设置row样式
    rowClassName({ row, rowIndex }) {
      // console.log(JSON.stringify(row))
      const data = row
      const res = []
      if (data.datas && data.datas.length > 0) {
        res.push('row-expand-has')
        return res
      } else {
        res.push('row-expand-unhas')
        return res
      }
    },
    // 判断当前行展开状态（通过唯一标识）
    expandChange(row, rows) {
      const isExpend = rows.some((r) => r.id === row.id)
      console.log('isExpend', isExpend)
      if (isExpend) {
        // Do some things
      }
    },
    // 查看采购单
    openPurchaseDetail(row) {
      this.searchPurchaseOrderDialog.visible = true
      this.searchPurchaseOrderDialog.tableLoading = true
      setTimeout(() => {
        this.searchPurchaseOrderDialog.tableData = [
          { id: 1, productName: "POLO衫经典款", specifications: "黄色 41", ardNo: 'jdk01-01', number: 1, availableStock: '', shipped: 1, needShipped: 0 }
        ]
        this.searchPurchaseOrderDialog.tableLoading = false

      }, 500);
    },
    // 关闭查看采购单弹框
    closeSearchPurchaseOrderDialog() {
      this.searchPurchaseOrderDialog.tableData = []
    },
    // 查看发货详情
    openShippedDetail(row) {
      this.searchShippedDialog.visible = true
      this.searchShippedDialog.tableLoading = true
      setTimeout(() => {
        this.searchShippedDialog.tableData = [
          { id: 1, productName: "POLO衫经典款", specifications: "黄色 41", ardNo: 'jdk01-01', purchasePrice: 99.88, purchaseNumber: 1, shipmentQuantity: 1 },
          { id: 2, productName: "POLO衫经典款", specifications: "黄色 42", ardNo: 'jdk01-01', purchasePrice: 99.88, purchaseNumber: 1, shipmentQuantity: 1 },
          { id: 3, productName: "POLO衫经典款", specifications: "黄色 43", ardNo: 'jdk01-01', purchasePrice: 99.88, purchaseNumber: 1, shipmentQuantity: 1 },
          { id: 4, productName: "POLO衫经典款", specifications: "黄色 44", ardNo: 'jdk01-01', purchasePrice: 99.88, purchaseNumber: 1, shipmentQuantity: 1 },
          { id: 5, productName: "POLO衫经典款", specifications: "黄色 45", ardNo: 'jdk01-01', purchasePrice: 99.88, purchaseNumber: 1, shipmentQuantity: 1 },
          { id: 6, productName: "POLO衫经典款", specifications: "黄色 46", ardNo: 'jdk01-01', purchasePrice: 99.88, purchaseNumber: 1, shipmentQuantity: 1 },
        ]
        this.searchShippedDialog.tableLoading = false

      }, 500);
    },
    // 关闭 发货详情弹框
    closeSearchShippedDialog() {
      this.searchShippedDialog.tableData = []
    },
    // 点击完成订单
    overOrder(row) {
      this.$confirm('确定采购单已处理完成吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('操作成功');
        this.initData()
      }).catch(() => { });
    }
  }
}
</script>

<style scoped lang="scss">
.sub_table_wrap {
  padding: 0 130px 0 48px;
}
</style>