<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="下单时间" prop="OrderTime">
            <el-date-picker style="width:250px" value-format="yyyy-MM-dd" v-model="searchForm.OrderTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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
          <el-form-item label="制作内容" prop="ProductContentsTwo">
            <el-select v-model="searchForm.ProductContentsTwo" placeholder="制作内容">
              <el-option v-for="item in ProductContentsTwoList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
            <span>总单量: 20</span>
            <span>总结算: ¥74527.25</span>
            <span>已结算: ¥40111.05</span>
            <span>未结算: ¥34416.20</span>
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
          <el-table-column label="制作内容" min-width="120" show-overflow-tooltip prop="b" />
          <el-table-column label="顾客" min-width="120" show-overflow-tooltip prop="c" />
          <el-table-column label="门店" min-width="120" show-overflow-tooltip prop="d" />
          <el-table-column label="顾问" min-width="120" show-overflow-tooltip prop="e" />
          <el-table-column label="下单时间" min-width="120" show-overflow-tooltip prop="f" />
          <el-table-column label="收款方式" min-width="120" show-overflow-tooltip prop="g" />
          <el-table-column label="进店渠道" min-width="120" show-overflow-tooltip prop="h" />
          <el-table-column label="交付时间(客户)" min-width="120" show-overflow-tooltip prop="i" />
          <el-table-column label="面料品牌" min-width="120" show-overflow-tooltip prop="j" />
          <el-table-column label="面料货号" min-width="120" show-overflow-tooltip prop="k" />
          <el-table-column label="面料单价(元/米)" min-width="120" show-overflow-tooltip prop="l" />
          <el-table-column label="面料数量(米)" min-width="120" show-overflow-tooltip prop="m" />
          <el-table-column label="面料价格(合计)" min-width="120" show-overflow-tooltip prop="n" />
          <el-table-column label="制作工厂" min-width="120" show-overflow-tooltip prop="o" />
          <el-table-column label="收费工艺项" min-width="120" show-overflow-tooltip prop="p" />
          <el-table-column label="工艺费" min-width="120" show-overflow-tooltip prop="q" />
          <el-table-column label="流程修改项" min-width="120" show-overflow-tooltip prop="r" />
          <el-table-column label="流程修改费" min-width="120" show-overflow-tooltip prop="s" />
          <el-table-column label="制作价格(合计)" min-width="120" show-overflow-tooltip prop="t" />
          <el-table-column label="成本总计(元)" min-width="120" show-overflow-tooltip prop="u" />
          <el-table-column label="产品售价(元)" min-width="120" show-overflow-tooltip prop="v" />
          <el-table-column label="实收价格(元)" min-width="120" show-overflow-tooltip prop="w" />
          <el-table-column label="制衣单状态" min-width="100" fixed="right" prop="x" />
          <el-table-column label="结算状态" min-width="100" fixed="right">
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.y | statusFilter">{{row.y}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="总结算费" min-width="100" fixed="right">
            <template slot-scope="{row}">
              <el-link @click="handleSettlement(row)" v-if="row.y=='待结算'" type="danger">{{row.z}}</el-link>
              <span v-else>{{row.z}}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <!-- <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button icon="el-icon-search" type="primary" plain @click="search(scope.row)"></el-button>
            </template>
          </el-table-column> -->
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
  name: 'StoreIncomeSettlement',
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
      // 制作内容2列表
      ProductContentsTwoList: [
        { id: 1, name: '全部' },
        { id: 2, name: '大衣' },
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
        ProductContentsTwo: 1, // 制作内容
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
            id: 1, a: 'WZNJ09883230714135239-1', b: '西服', c: 'Tom', d: '邯郸店', e: '李敏', f: '2023-07-14', g: '支付宝', h: '百度', i: '2023-07-12', j: '世佳宝', k: 'NB123', l: '889.00', m: '3.00', n: '299.00', o: '测试工厂', p: '西服-制作工艺-半麻衬: ¥1000.00', q: '¥1000.00', r: '', s: '￥200.00', t: '¥10000.00', u: '¥12667.00', v: '¥11048.40', w: '¥11048.40', x: '已完成', y: '待结算', z: '¥7981.40'
          },
          {
            id: 2, a: 'WZNJ09883230714135239-1', b: '西服', c: 'Tom', d: '邯郸店', e: '李敏', f: '2023-07-14', g: '支付宝', h: '百度', i: '2023-07-12', j: '世佳宝', k: 'NB123', l: '889.00', m: '3.00', n: '299.00', o: '测试工厂', p: '西服-制作工艺-半麻衬: ¥1000.00', q: '¥1000.00', r: '', s: '￥200.00', t: '¥10000.00', u: '¥12667.00', v: '¥11048.40', w: '¥11048.40', x: '已完成', y: '已结算', z: '¥7981.40'
          },
          {
            id: 3, a: 'WZNJ09883230714135239-1', b: '西服', c: 'Tom', d: '邯郸店', e: '李敏', f: '2023-07-14', g: '支付宝', h: '百度', i: '2023-07-12', j: '世佳宝', k: 'NB123', l: '889.00', m: '3.00', n: '299.00', o: '测试工厂', p: '西服-制作工艺-半麻衬: ¥1000.00', q: '¥1000.00', r: '', s: '￥200.00', t: '¥10000.00', u: '¥12667.00', v: '¥11048.40', w: '¥11048.40', x: '已完成', y: '待结算', z: '¥7981.40'
          },
          {
            id: 4, a: 'WZNJ09883230714135239-1', b: '西服', c: 'Tom', d: '邯郸店', e: '李敏', f: '2023-07-14', g: '支付宝', h: '百度', i: '2023-07-12', j: '世佳宝', k: 'NB123', l: '889.00', m: '3.00', n: '299.00', o: '测试工厂', p: '西服-制作工艺-半麻衬: ¥1000.00', q: '¥1000.00', r: '', s: '￥200.00', t: '¥10000.00', u: '¥12667.00', v: '¥11048.40', w: '¥11048.40', x: '已完成', y: '已结算', z: '¥7981.40'
          },
          {
            id: 5, a: 'WZNJ09883230714135239-1', b: '西服', c: 'Tom', d: '邯郸店', e: '李敏', f: '2023-07-14', g: '支付宝', h: '百度', i: '2023-07-12', j: '世佳宝', k: 'NB123', l: '889.00', m: '3.00', n: '299.00', o: '测试工厂', p: '西服-制作工艺-半麻衬: ¥1000.00', q: '¥1000.00', r: '', s: '￥200.00', t: '¥10000.00', u: '¥12667.00', v: '¥11048.40', w: '¥11048.40', x: '已完成', y: '已结算', z: '¥7981.40'
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
        const tHeader = ['序号', '制衣单号', '制作内容', '顾客', '门店', '顾问', '下单时间', '收款方式', '进店渠道', '交付时间(客户)', '面料品牌', '面料货号', '面料单价(元/米)', '面料数量(米)', '面料价格(合计)', '制作工厂', '收费工艺项', '工艺费', '流程修改项', '流程修改费', '制作价格(合计)', '成本总计(元)', '产品售价(元)', '实收价格(元)', '制衣单状态', '结算状态', '总结算费']
        const filterVal = ['id', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
        const list = this.tableDataList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader, //表头 必填
          data, //具体数据 必填
          filename: '门店收入结算', //非必填
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