<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="下单时间" prop="OrderTime">
            <el-date-picker style="width:250px" v-model="searchForm.OrderTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结算状态" prop="SettlementStatus">
            <el-select v-model="searchForm.SettlementStatus" placeholder="结算状态">
              <el-option v-for="item in SettlementStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="定制顾问" prop="CustomizedConsultant">
            <el-select v-model="searchForm.CustomizedConsultant" placeholder="定制顾问">
              <el-option v-for="item in CustomizedConsultantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="制衣单号" prop="OrderNumber">
            <el-input v-model="searchForm.OrderNumber" clearable placeholder="制衣单号" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item label="制作内容" prop="ProductContents">
            <el-select v-model="searchForm.ProductContents" placeholder="制作内容">
              <el-option v-for="item in ProductContentsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称" prop="CustomerName">
            <el-input v-model="searchForm.CustomerName" clearable placeholder="客户名称" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item label="门店" prop="Store">
            <el-select v-model="searchForm.Store" placeholder="门店">
              <el-option v-for="item in StoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工厂" prop="Factory">
            <el-select v-model="searchForm.Factory" placeholder="工厂">
              <el-option v-for="item in FactoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="面料商" prop="FabricMerchant">
            <el-select v-model="searchForm.FabricMerchant" placeholder="面料商">
              <el-option v-for="item in FabricMerchantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
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
          <div class="total">
            <span>总单量: 120</span>
            <span>总结算: ¥21237.25</span>
            <span>已结算: ¥123121.05</span>
            <span>未结算: ¥33316.20</span>
          </div>
          <div><el-button type="primary" :loading="downloadLoading" @click="handleDownload" icon="el-icon-download">导出 Excel</el-button></div>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="制衣单号" min-width="250" show-overflow-tooltip prop="a" />
          <el-table-column label="下单方" min-width="120" show-overflow-tooltip prop="b" />
          <el-table-column label="制衣厂" min-width="120" show-overflow-tooltip prop="c" />
          <el-table-column label="下单时间" min-width="120" show-overflow-tooltip prop="d" />
          <el-table-column label="交付时间(客户)" min-width="120" show-overflow-tooltip prop="e" />
          <el-table-column label="客户" min-width="120" show-overflow-tooltip prop="f" />
          <el-table-column label="制作内容" min-width="120" show-overflow-tooltip prop="g" />
          <el-table-column label="面料商" min-width="120" show-overflow-tooltip prop="h" />
          <el-table-column label="面料品牌" min-width="120" show-overflow-tooltip prop="i" />
          <el-table-column label="面料货号" min-width="120" show-overflow-tooltip prop="j" />
          <el-table-column label="面料成分" min-width="120" show-overflow-tooltip prop="k" />
          <el-table-column label="面料纱织" min-width="120" show-overflow-tooltip prop="l" />
          <el-table-column label="克重gms" min-width="120" show-overflow-tooltip prop="m" />
          <el-table-column label="门幅cm" min-width="120" show-overflow-tooltip prop="n" />
          <el-table-column label="价格(元/米)" min-width="120" show-overflow-tooltip prop="o" />
          <el-table-column label="使用长度(米)" min-width="120" show-overflow-tooltip prop="p" />
          <el-table-column label="制衣单状态" min-width="120" fixed="right" prop="q" />
          <el-table-column label="结算状态" min-width="100" fixed="right">
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.r | statusFilter">{{row.r}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="总结算费" min-width="100" fixed="right">
            <template slot-scope="{row}">
              <el-link @click="handleSettlement(row)" v-if="row.r=='待结算'" type="danger">{{row.s}}</el-link>
              <span v-else>{{row.s}}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 结算弹框 -->
    <el-dialog title="结算" :visible.sync="settlementDialog" @closed="closeSettlementDialog" width="30%">
      <div>
        <div><span>这是一段信息</span></div>
      </div>
      <span slot="footer">
        <el-button @click="settlementDialog = false">取 消</el-button>
        <el-button type="primary" @click="settlementDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FabricSupplierSettlement',
  data() {
    return {
      // 结算状态列表
      SettlementStatusList: [
        { id: 1, name: '全部' },
        { id: 2, name: '已结算' },
        { id: 3, name: '待结算' },
      ],
      // 定制顾问列表
      CustomizedConsultantList: [
        { id: 1, name: '全部' },
        { id: 2, name: '张无忌' },
      ],
      // 制作内容列表
      ProductContentsList: [
        { id: 1, name: '全部' },
        { id: 2, name: '定制' },
      ],
      // 门店列表
      StoreList: [
        { id: 1, name: '全部' },
        { id: 2, name: '北京店' },
      ],
      // 工厂列表
      FactoryList: [
        { id: 1, name: '全部' },
        { id: 2, name: '北京工厂店' },
      ],
      // 面料商列表
      FabricMerchantList: [
        { id: 1, name: '全部' },
        { id: 2, name: '北京面料' },
      ],
      searchForm: {
        OrderTime: "", // 下单时间
        SettlementStatus: 1, // 结算状态
        CustomizedConsultant: 1, // 定制顾问
        OrderNumber: "", // 制衣单号
        ProductContents: 1, // 制作内容
        CustomerName: "", // 客户名称
        Store: 1, // 门店
        Factory: 1, // 工厂
        FabricMerchant: 1, // 面料商 
      },
      downloadLoading: false, // 导出按钮加载状态
      tableLoading: false, // table 加载状态
      tableDataList: [],
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },
      settlementDialog: false, // 结算弹框
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "已结算": 'success',
        "待结算": 'danger',
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
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          {
            id: 1, a: 'WZNJ09883230714135239-1', b: '南京店', c: '测试工厂', d: '2023-07-11', e: '2023-07-12', f: '图图', g: '西服', h: '上海工厂', i: '世佳宝', j: 'NB123', k: '羊毛', l: '', m: '0', n: '299', o: '¥889.00', p: '3.00', q: '制造中', r: '已结算', s: '￥200.00',
          },
          {
            id: 2, a: 'WZNJ09883230714135239-1', b: '南京店', c: '测试工厂', d: '2023-07-11', e: '2023-07-12', f: '图图', g: '西服', h: '上海工厂', i: '世佳宝', j: 'NB123', k: '羊毛', l: '', m: '0', n: '299', o: '¥889.00', p: '3.00', q: '制造中', r: '待结算', s: '￥200.00',
          },
          {
            id: 3, a: 'WZNJ09883230714135239-1', b: '南京店', c: '测试工厂', d: '2023-07-11', e: '2023-07-12', f: '图图', g: '西服', h: '上海工厂', i: '世佳宝', j: 'NB123', k: '羊毛', l: '', m: '0', n: '299', o: '¥889.00', p: '3.00', q: '制造中', r: '待结算', s: '￥200.00',
          },
        ]
        this.tableLoading = false;
      }, 500);

    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 导出excel
    handleDownload() {
      this.downloadLoading = true
      import('@/utils/Export2Excel').then(excel => {
        const tHeader = ['序号', '制衣单号', '下单方', '制衣厂', '下单时间', '交付时间(客户)', '客户', '制作内容', '面料商', '面料品牌', '面料货号', '面料成分', '面料纱织', '克重gms', '门幅cm', '价格(元/米)', '使用长度(米)', '制衣单状态', '结算状态', '总结算费']
        const filterVal = ['id', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's']
        const list = this.tableDataList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader, //表头 必填
          data, //具体数据 必填
          filename: '面料商结算', //非必填
          autoWidth: true, //非必填
          bookType: 'xlsx' //非必填
        })
        this.downloadLoading = false
      }).catch(e => {
        this.$message.error('导出Excel失败')
        this.downloadLoading = false
      })
    },
    // 格式化导出数据
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
        // if (j === 'timestamp') {
        //   return parseTime(v[j])
        // } else {
        //   return v[j]
        // }
      }))
    },
    // 打开 结算弹框
    handleSettlement(row) {
      this.settlementDialog = true;
    },
    // 关闭 结算弹框
    closeSettlementDialog() {

    }
  }
}
</script>

<style lang="scss" scoped>
.tableMenuBtn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: bold;
  .total {
    display: flex;
    gap: 10px;
    margin-right: 10px;
  }
}
</style>