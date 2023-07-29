<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="起止时间" prop="OrderTime">
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
          <el-form-item label="选择排序">
            <el-form-item prop="sort" style="margin:0">
              <el-select v-model="searchForm.sort">
                <el-option v-for="item in sortList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="sortType" style="margin:0">
              <el-select v-model="searchForm.sortType" class="w80">
                <el-option v-for="item in sortTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
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
          <el-table-column label="制作工厂" min-width="120" show-overflow-tooltip prop="b" />
          <el-table-column label="下单方" min-width="120" show-overflow-tooltip prop="c" />
          <el-table-column label="顾客" min-width="120" show-overflow-tooltip prop="d" />
          <el-table-column label="品牌下单时间" min-width="120" show-overflow-tooltip prop="e" />
          <el-table-column label="面料发货时间" min-width="120" show-overflow-tooltip prop="f" />
          <el-table-column label="门店签收时间" min-width="120" show-overflow-tooltip prop="g" />
          <el-table-column label="制作内容" min-width="120" show-overflow-tooltip prop="h" />
          <el-table-column label="面料品牌" min-width="120" show-overflow-tooltip prop="i" />
          <el-table-column label="面料货号" min-width="120" show-overflow-tooltip prop="j" />
          <el-table-column label="制作工艺" min-width="120" show-overflow-tooltip prop="k" />
          <el-table-column label="制作工费" min-width="120" show-overflow-tooltip prop="l" />
          <el-table-column label="高级工艺项" min-width="120" show-overflow-tooltip prop="m" />
          <el-table-column label="高级工艺费" min-width="120" show-overflow-tooltip prop="n" />
          <el-table-column label="流程修改项" min-width="120" show-overflow-tooltip prop="o" />
          <el-table-column label="流程修改费" min-width="120" show-overflow-tooltip prop="p" />
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
  name: 'FactorySettlement',
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
      // 排序
      sortList: [
        { id: 1, name: '下单日期' },
        { id: 2, name: '要求货期' },
      ],
      sortTypeList: [
        { id: 1, name: '顺序' },
        { id: 2, name: '倒序' },
      ],
      searchForm: {
        OrderTime: "", // 起止时间
        SettlementStatus: 1, // 结算状态
        CustomizedConsultant: 1, // 定制顾问
        OrderNumber: "", // 制衣单号
        ProductContents: 1, // 制作内容
        CustomerName: "", // 客户名称
        Store: 1, // 门店
        Factory: 1, // 工厂
        FabricMerchant: 1, // 面料商 
        sort: 1, // 排序
        sortType: 1, // 顺序，倒序
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
            id: 1, a: 'WZNJ09883230714135239-1', b: '北京工厂', c: '北京店', d: 'Jerry', e: '2023-07-12', f: '2023-07-12', g: '', h: '西服', i: '世佳宝', j: 'NB123', k: '粘合衬', l: '¥1000.00', m: '', n: '¥0.00', o: '', p: '', q: '制造中', r: '已结算', s: '￥200.00',
          },
          {
            id: 2, a: 'WZNJ09883230714135239-1', b: '北京工厂', c: '北京店', d: 'Jerry', e: '2023-07-12', f: '2023-07-12', g: '', h: '西服', i: '世佳宝', j: 'NB123', k: '粘合衬', l: '¥1000.00', m: '', n: '¥0.00', o: '', p: '', q: '制造中', r: '待结算', s: '￥200.00',
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
        const tHeader = ['序号', '制衣单号', '制作工厂', '下单方', '顾客', '品牌下单时间', '面料发货时间', '门店签收时间', '制作内容', '面料品牌', '面料货号', '制作工艺', '制作工费', '高级工艺项', '高级工艺费', '流程修改项', '流程修改费', '制衣单状态', '结算状态', '总结算费']
        const filterVal = ['id', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's']
        const list = this.tableDataList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader, //表头 必填
          data, //具体数据 必填
          filename: '工厂结算', //非必填
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