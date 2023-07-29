<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
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
        <div class="tableMenuBtn">
          <el-tabs v-model="activeMenuName" @tab-click="handleMenuClick">
            <el-tab-pane label="待处理" name="待处理"></el-tab-pane>
            <el-tab-pane label="完成" name="完成"></el-tab-pane>
            <el-tab-pane label="已取消" name="已取消"></el-tab-pane>
          </el-tabs>
          <el-button type="primary" @click="addTransfer" icon="el-icon-plus">发起调拨</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
          <el-table-column label="订单" min-width="150" show-overflow-tooltip prop="orderNo"></el-table-column>
          <el-table-column label="发货门店" min-width="120" show-overflow-tooltip prop="fhstore"></el-table-column>
          <el-table-column label="收货门店" min-width="120" show-overflow-tooltip prop="shstore"></el-table-column>
          <el-table-column label="订单商品" min-width="120">
            <template slot-scope="{row}">
              <el-link @click="openTransferDetail(row)" type="primary">共{{row.optionNum}}项</el-link> <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
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
          <el-table-column label="操作" width="260" fixed="right">
            <template slot-scope="{row}" v-if="activeMenuName=='待处理'">
              <el-button icon="el-icon-shopping-cart-full" type="primary" @click="storeFH(row)">本店发货</el-button>
              <el-button icon="el-icon-close" type="danger" @click="removeOrder(row)">取消订单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 查看调拨单 -->
    <el-dialog title="查看调拨单" top="8vh" :visible.sync="searchTransferOrderDialog.visible" width="65%" @closed="closeSearchTransferOrderDialog">
      <el-table class="hhy-table" v-loading="searchTransferOrderDialog.tableLoading" element-loading-text="加载中..." height="400" :data="searchTransferOrderDialog.tableData" stripe :header-cell-style="{textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column label="采购商品" show-overflow-tooltip prop="productName" />
        <el-table-column label="规格" show-overflow-tooltip prop="specifications" />
        <el-table-column label="货号" show-overflow-tooltip prop="ardNo" />
        <el-table-column label="数量" prop="number" />
        <el-table-column label="可用库存">
          <template slot-scope="{row}">
            <el-tag type="success" v-for="i,index in row.availableStockList" :key="index">{{i}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="已发货" prop="shipped" />
        <el-table-column label="还需发货" prop="needShipped" />
      </el-table>
    </el-dialog>

    <!-- 调拨单发货 -->
    <el-dialog title="调拨单发货" top="8vh" :visible.sync="TransferOrderFHDialog.visible" width="70%" @closed="closeTransferOrderFHDialog">
      <el-table class="hhy-table" :data="TransferOrderFHDialog.tableData" stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column label="采购商品" show-overflow-tooltip prop="productName" />
        <el-table-column label="规格" show-overflow-tooltip prop="specifications" />
        <el-table-column label="货号" show-overflow-tooltip prop="ardNo" />
        <el-table-column label="采购价" prop="purchasePrice" />
        <el-table-column label="采购数量" prop="purchaseNumber" />
        <el-table-column label="可用库存" show-overflow-tooltip min-width="120">
          <template slot-scope="{row}">
            <el-tag type="success" v-for="i,index in row.availableStockList" :key="index">{{i}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="已发货" prop="shipped" />
        <el-table-column label="剩余" prop="residue">
          <template slot-scope="{row}">
            <el-tag type="danger">{{row.residue}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发货数量" width="120px">
          <template slot-scope="{row}">
            <el-input style="width:90px" maxlength="5" v-model="row.fhNumber" clearable oninput="value=value.replace(/[^\d]/g,'')" />
          </template>
        </el-table-column>
      </el-table>
      <el-form ref="fhFormRef" :model="TransferOrderFHDialog.fhForm" :inline="false" :rules="TransferOrderFHDialog.fhFormRules" label-width="100px">
        <div class="hhy-tips" style="margin-top:15px;">
          <p>配送信息</p>
        </div>
        <el-form-item label="发货仓">
          {{TransferOrderFHDialog.fhForm.shippingBin}}
        </el-form-item>
        <el-form-item label="收货人">
          {{TransferOrderFHDialog.fhForm.addressee}}
        </el-form-item>
        <el-form-item label="收货地址">
          {{TransferOrderFHDialog.fhForm.address}}
        </el-form-item>
        <div class="hhy-tips">
          <p>物流</p>
        </div>
        <el-form-item label="物流公司" prop="distribution">
          <el-select v-model="TransferOrderFHDialog.fhForm.distribution" placeholder="请选择物流公司" filterable clearable>
            <el-option v-for="item in TransferOrderFHDialog.distributionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="trackingNumber">
          <el-input clearable placeholder="请输入快递单号" v-model="TransferOrderFHDialog.fhForm.trackingNumber" style="width:210px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="TransferOrderFHDialog.visible = false">取 消</el-button>
        <el-button :loading="TransferOrderFHDialog.submitLoading" type="primary" @click="handleTransferOrderFH('fhFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PurchaseOrder",
  data() {
    return {
      searchForm: {
        date: "", // 起止时间
        orderNumber: "", // 单号 
      },
      activeMenuName: "待处理", // 选中菜单
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
      searchTransferOrderDialog: {
        visible: false,
        tableData: [],
        tableLoading: false,
      },
      // 调拨单发货弹框
      TransferOrderFHDialog: {
        visible: false,
        tableData: [],
        distributionList: [
          { id: 1, name: '京东' },
          { id: 2, name: '顺丰' },
        ],
        submitLoading: false,
        fhForm: {
          shippingBin: "乔丹品牌", // 发货仓
          addressee: "张三丰", // 收货人
          address: "北京市海淀区上地七街", // 收货地址
          distribution: "", // 物流公司
          trackingNumber: "", // 快递单号
        },
        fhFormRules: {
          distribution: [
            { required: true, message: '请选择物流公司', trigger: 'change' }
          ],
          trackingNumber: [
            { required: true, message: '请输入快递单号', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入快递单号', trigger: 'blur' }
          ],
        },
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
        "处理中": 'warning',
        "已完成": 'success',
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
        if (this.activeMenuName == '待处理') {
          DataList = [
            { id: 1, orderNo: '00059230701161837', fhstore: "北京店", shstore: "北京店", optionNum: 1, status: '未发货', orderStatus: '处理中', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37', },
            { id: 2, orderNo: '00059230701161837', fhstore: "北京店", shstore: "北京店", optionNum: 1, status: '未发货', orderStatus: '处理中', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37' },
            { id: 3, orderNo: '00059230701161837', fhstore: "北京店", shstore: "北京店", optionNum: 1, status: '未发货', orderStatus: '处理中', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37' },
            { id: 4, orderNo: '00059230701161837', fhstore: "北京店", shstore: "北京店", optionNum: 1, status: '未发货', orderStatus: '处理中', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37' },
            { id: 5, orderNo: '00059230701161837', fhstore: "北京店", shstore: "北京店", optionNum: 1, status: '未发货', orderStatus: '处理中', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37' },
          ]
        } else if (this.activeMenuName == '完成') {
          DataList = [
            { id: 1, orderNo: '00059230701161837', fhstore: "北京店", shstore: "北京店", optionNum: 1, status: '已发完', orderStatus: '已完成', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37' },
          ]
        } else if (this.activeMenuName == '已取消') {
          DataList = [
            { id: 1, orderNo: '00059230701161837', fhstore: "北京店", shstore: "北京店", optionNum: 1, status: '已发完', orderStatus: '已取消', amount: '200.00', sendCount: '2次', createDate: '2023-07-01 16:18:37' },
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
    // 查看调拨单
    openTransferDetail(row) {
      this.searchTransferOrderDialog.visible = true
      this.searchTransferOrderDialog.tableLoading = true
      setTimeout(() => {
        this.searchTransferOrderDialog.tableData = [
          { id: 1, productName: "POLO衫经典款", specifications: "黄色 41", ardNo: 'jdk01-01', number: 1, availableStockList: ['乔丹品牌: 580', '南京店: 559'], shipped: 1, needShipped: 2 },
        ]
        this.searchTransferOrderDialog.tableLoading = false
      }, 500);
    },
    // 关闭查看调拨单弹框
    closeSearchTransferOrderDialog() {
      this.searchTransferOrderDialog.tableData = []
    },
    // 发起调拨
    addTransfer() {
      this.$router.push({ name: 'AddTransferOrder' })
    },
    // 本店发货（调拨单发货弹框）
    storeFH(row) {
      this.TransferOrderFHDialog.visible = true;
      this.TransferOrderFHDialog.tableData = [
        { id: 1, productName: '商务衬衫', specifications: "蓝色 41", ardNo: 'nb12345', purchasePrice: 150.00, purchaseNumber: 2, availableStockList: ['乔丹品牌：30'], shipped: 0, residue: 2, fhNumber: 0 },
        { id: 2, productName: '商务衬衫', specifications: "蓝色 41", ardNo: 'nb12345', purchasePrice: 150.00, purchaseNumber: 2, availableStockList: ['乔丹品牌：30'], shipped: 0, residue: 2, fhNumber: 0 }
      ];
    },
    // 调拨单发货弹框 点击确定按钮
    handleTransferOrderFH(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.TransferOrderFHDialog.submitLoading = true;
          setTimeout(() => {
            this.TransferOrderFHDialog.submitLoading = false;
            this.TransferOrderFHDialog.visible = false;
            this.$message.success('操作成功')
          }, 500);
        } else {
          return false;
        }
      })
    },
    // 关闭调拨单发货弹框
    closeTransferOrderFHDialog() {
      this.$refs['fhFormRef'].resetFields();
    },
    // 删除订单
    removeOrder(row) {
      this.$confirm('确定要取消订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('取消成功');
        this.initData()
      }).catch(() => { });
    },
  }
}
</script>

<style>
</style>