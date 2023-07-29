<template>
  <div class="hhy-container">
    <!-- 顶部筛选 -->
    <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
      <el-form-item label="门店" prop="Store">
        <el-select v-model="searchForm.Store" placeholder="选择门店">
          <el-option v-for="item in StoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="制作类型" prop="ProductionType">
        <el-select v-model="searchForm.ProductionType" placeholder="选择制作类型">
          <el-option v-for="item in ProductionTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单号" prop="OrderNumber">
        <el-input v-model="searchForm.OrderNumber" clearable placeholder="输入订单号" @keyup.enter.native="initData"></el-input>
      </el-form-item>
      <el-form-item label="客户手机" prop="CustomerPhone">
        <el-input v-model="searchForm.CustomerPhone" maxlength="11" clearable placeholder="输入客户手机号" @keyup.enter.native="initData" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="客户名" prop="CustomerName">
        <el-input v-model="searchForm.CustomerName" clearable placeholder="输入客户名称" @keyup.enter.native="initData"></el-input>
      </el-form-item>
      <el-form-item label="起止时间" prop="Time">
        <el-date-picker style="width:250px" value-format="yyyy-MM-dd" v-model="searchForm.Time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="选择排序">
        <el-form-item prop="Sort" style="margin:0">
          <el-select v-model="searchForm.Sort">
            <el-option v-for="item in SortList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="SortType" style="margin:0">
          <el-select v-model="searchForm.SortType" class="w80">
            <el-option v-for="item in SortTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="工厂" prop="Factory">
        <el-select v-model="searchForm.Factory" placeholder="选择工厂">
          <el-option v-for="item in FactoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="面料商" prop="FabricMerchant">
        <el-select v-model="searchForm.FabricMerchant" placeholder="选择面料商">
          <el-option v-for="item in FabricMerchantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="initData" type="primary" class="hhy-search-btn" round>查询</el-button>
        <el-button @click="resetSearchForm('searchForm')" type="danger" class="hhy-reset-btn" round>重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格顶部菜单 -->
    <div class="tableMenuBtn">
      <el-tabs v-model="activeMenuName" @tab-click="handleMenuClick">
        <el-tab-pane v-for="item in activeMenuNameList" :key="item.id" :name="item.name">
          <span slot="label">
            <el-badge :hidden="Number(item.number)==0" :value="Number(item.number)" :max="99"><i :class="item.icon"></i> {{item.name}}</el-badge>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 表格数据 -->
    <el-table v-loading="tableLoading" default-expand-all class="hhy-table" :span-method="arraySpanMethod" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}">
      <!-- 子表格数据 -->
      <el-table-column type="expand" width="50">
        <template slot-scope="props">
          <el-table :data="props.row.tableData" class="sub-el-table" :span-method="(params)=>subTableArraySpanMethod(params,props.row.tableData.length)" border :show-header="false">
            <!-- 制衣单 -->
            <el-table-column min-width="70%">
              <template slot-scope="{row}">
                <div class="ClothingList_wrap">
                  <p class="flex-row-wrap">子单号：{{row.orderNo}} <el-tag :type="row.type | statusFilter">{{row.type}}</el-tag> <el-tag v-if="row.status" :type="row.status | statusFilter">{{row.status}}</el-tag></p>
                  <div class="cont">
                    <div class="lf">
                      <div class="lf_l">
                        <el-image v-for="img,index in row.imgList" :key="index" :src="img" :preview-src-list="row.imgList"> </el-image>
                      </div>
                      <div class="lf_r">
                        <p class="tit flex-row-wrap">{{row.productName}} <el-tag type="info" v-if="row.artNo">货号：{{row.artNo}}</el-tag><el-tag type="info" v-if="row.specifications">规格：{{row.specifications}}</el-tag></p>
                        <span>单价：¥ {{row.unitPrice}}</span>
                        <span>数量：{{row.number}}件</span>
                        <p class="flex-row-wrap"><el-tag type="info">面料：{{row.fabric}}</el-tag><el-tag type="info">工厂：{{row.factory}}</el-tag></p>
                      </div>
                    </div>
                    <div class="rt">
                      <p><el-link type="primary" @click="handleSearchClothingList(row)">查看制衣单</el-link></p>
                      <p><el-link type="primary" @click="handleZYDLZ(row)">制衣单流转</el-link></p>
                      <p><el-link type="primary" @click="handleSearchFabricLogistics(row,'查看')">查看布料物流</el-link></p>
                      <p><el-link type="primary" @click="handleSearchFabricLogistics(row,'发货')">布料发货</el-link></p>
                      <p>
                        <el-popconfirm @confirm="handleWithdrawZYD(row)" @onConfirm="handleWithdrawZYD(row)" title="撤回后，工厂和面料商将看不到该单，确认吗？">
                          <el-link slot="reference" type="primary">撤回制衣单</el-link>
                        </el-popconfirm>
                      </p>
                      <p><el-link type="primary" @click="handleCYFH(row)">成衣发货</el-link></p>
                      <p><el-link type="primary" @click="handleLowerGarmentList(row)">下制衣单</el-link></p>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="50"></el-table-column>
            <el-table-column width="50"></el-table-column>
            <!-- 订单金额 -->
            <el-table-column min-width="10%" align="center" label="订单金额">
              <template slot-scope="{row}">
                ￥ {{row.price}}
              </template>
            </el-table-column>
            <!-- 客户(顾问) -->
            <el-table-column label="客户(顾问)" align="center" min-width="10%">
              <template slot-scope="{row}">
                <el-link type="primary" @click="$router.push('/CustomerManagement/detail/'+row.id)">{{row.customName}}</el-link>
                <p>顾问: {{row.consultant}}</p>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" align="center" min-width="10%">
              <template slot-scope="{row}">
                <p><el-link type="primary" @click="handlePrint(row)">打印订单</el-link></p>
                <p>
                  <el-popconfirm @confirm="handleApproved(row)" @onConfirm="handleApproved(row)" title="确认资金已经处理了吗？">
                    <el-link slot="reference" type="primary">通过审核</el-link>
                  </el-popconfirm>
                </p>
                <p><el-link type="primary" @click="handleRejectReview(row)">驳回审核</el-link></p>
                <p><el-link type="primary" @click="handleReturnEdit(row)">退回修改</el-link></p>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="props.row.reject" class="subTable_foot_tips">审核原因: {{props.row.reject}}</div>
        </template>
      </el-table-column>
      <!-- 序号 -->
      <el-table-column type="index" label="序号" width="50" :index="indexMethod" />
      <el-table-column label="制衣单" min-width="70%">
        <template slot-scope="{row}">
          <div class="el-table-title-wrap">
            <div class="lt">
              <el-tag><svg-icon class="custom-store" icon-class="store" /> {{row.Store}}</el-tag>
              <span> 收单时间：{{row.ReceiptTime}} </span>
              <span> 付款日期：{{row.paymentDate}} </span>
              <span> 订单号：{{row.OrderNumber}} </span>
            </div>
            <div class="rt">
              <el-link type="primary" @click="searchDetail(row)">查看详情</el-link>
              <el-link type="primary" @click="handleRemarks(row)">备注</el-link>
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" min-width="10%" />
      <el-table-column label="客户(顾问)" min-width="10%" />
      <el-table-column label="操作" min-width="10%" />
    </el-table>
    <!-- 分页 -->
    <myPagination :pager="pager" @query="initData" />

    <!-- 订单备注 弹框 -->
    <RemarksDialog :is-show.sync="RemarksDialog.isShowDialog" :id="RemarksDialog.id" @success="RemarksDialogSuccess" />

    <!-- 查看制衣单 弹框 -->
    <ClothingListDialog :is-show.sync="ClothingListDialog.isShowDialog" :id="ClothingListDialog.id" />

    <!-- 制衣单流转弹框 -->
    <ZYDLZDailog :is-show.sync="ZYDLZDailog.isShowDialog" :id="ZYDLZDailog.id" />

    <!-- 查看布料物流，布料发货 弹框 -->
    <FabricLogisticsDialog :dialog-type="FabricLogisticsDialog.dialogType" :is-show.sync="FabricLogisticsDialog.isShowDialog" :id.sync="FabricLogisticsDialog.id" @success="FabricLogisticsDialogSuccess" />

    <!-- 成衣发货 弹框-->
    <ReadyWearSendDialog :is-show.sync="ReadyWearSendDialog.isShowDialog" :id.sync="ReadyWearSendDialog.id" @success="ReadyWearSendDialogSuccess" @closed="closeReadyWearSendDialogSuccess" />

    <!-- 下制衣单 弹框 -->
    <LowerGarmentListDialog :is-show.sync="LowerGarmentListDialog.isShowDialog" :id="LowerGarmentListDialog.id" @success="LowerGarmentListDialogSuccess" />

    <!-- 填充下制衣单数据 弹框 -->
    <LowerGarmentListEditDialog :is-show.sync="LowerGarmentListEditDialog.isShowDialog" :id="LowerGarmentListEditDialog.id" @success="LowerGarmentListEditDialogSuccess" />

    <!-- 打印订单 弹框 -->
    <PrintDialog :is-show.sync="PrintDialog.isShowDialog" :id="PrintDialog.id" />

    <!-- 驳回审核 弹框  -->
    <RejectReviewtDialog :is-show.sync="RejectReviewtDialog.isShowDialog" :id="RejectReviewtDialog.id" @success="RejectReviewtDialogSuccess" />

    <!-- 退回修改 弹框 -->
    <ReturnEditDialog :is-show.sync="ReturnEditDialog.isShowDialog" :id="ReturnEditDialog.id" @success="ReturnEditDialogSuccess" />

  </div>
</template>

<script>
import RemarksDialog from './components/RemarksDialog.vue'
import ClothingListDialog from './components/ClothingListDialog.vue'
import ZYDLZDailog from './components/ZYDLZDailog.vue'
import FabricLogisticsDialog from './components/FabricLogisticsDialog.vue'
import ReadyWearSendDialog from './components/ReadyWearSendDialog.vue'
import LowerGarmentListDialog from './components/LowerGarmentListDialog.vue'
import LowerGarmentListEditDialog from './components/LowerGarmentListEditDialog.vue'
import PrintDialog from './components/PrintDialog.vue'
import RejectReviewtDialog from './components/RejectReviewtDialog.vue'
import ReturnEditDialog from './components/ReturnEditDialog.vue'
export default {
  name: "OrderManagement",
  components: { RemarksDialog, ClothingListDialog, ZYDLZDailog, FabricLogisticsDialog, ReadyWearSendDialog, LowerGarmentListDialog, LowerGarmentListEditDialog, PrintDialog, RejectReviewtDialog, ReturnEditDialog },
  data() {
    return {
      // 门店列表
      StoreList: [
        { id: 1, name: '全部' },
        { id: 2, name: '北京店' },
      ],
      // 制作类型列表
      ProductionTypeList: [
        { id: 1, name: '全部' },
        { id: 2, name: '直接成品' },
        { id: 3, name: '本料半成品' },
        { id: 4, name: '毛壳半成品' },
      ],
      // 选择排序列表
      SortList: [
        { id: 1, name: '下单时间' },
        { id: 2, name: '客户交付时间' },
      ],
      SortTypeList: [
        { id: 1, name: '顺序' },
        { id: 2, name: '倒序' },
      ],
      // 工厂列表
      FactoryList: [
        { id: 1, name: '全部' },
        { id: 2, name: '北京工厂' },
        { id: 3, name: '南京工厂' },
      ],
      // 面料商列表
      FabricMerchantList: [
        { id: 1, name: '全部' },
        { id: 2, name: '耐克面料' },
        { id: 3, name: '乔丹面料' },
      ],
      // 顶部搜索表单
      searchForm: {
        Store: 1, // 门店
        ProductionType: 1, // 制作类型
        OrderNumber: "", // 订单号
        CustomerPhone: "", // 客户手机
        CustomerName: "", // 客户名
        Time: "", // 起止时间
        Sort: 1, // 选择排序
        SortType: 1, // 顺序，倒序
        Factory: 1, // 工厂
        FabricMerchant: 1, // 面料商
      },
      activeMenuNameList: [
        { id: 1, name: '全部', number: '', icon: 'el-icon-menu' },
        { id: 2, name: '待提(改)单', number: 3, icon: 'el-icon-edit' },
        { id: 3, name: '待审核', number: '', icon: 'el-icon-time' },
        { id: 4, name: '待下制衣单', number: 5, icon: 'el-icon-date' },
        { id: 5, name: '面料修改', number: '', icon: 'el-icon-reading' },
        { id: 6, name: '面料发货', number: 10, icon: 'el-icon-truck' },
        { id: 7, name: '工厂制造', number: '', icon: 'el-icon-office-building' },
        { id: 8, name: '待收货', number: 500, icon: 'el-icon-shopping-cart-2' },
        { id: 9, name: '已收货/待交付', number: '', icon: 'el-icon-shopping-cart-full' },
        { id: 10, name: '待返工', number: '', icon: 'el-icon-refresh' },
        { id: 11, name: '已完成', number: '', icon: 'el-icon-circle-check' },
        { id: 12, name: '已取消', number: '', icon: 'el-icon-circle-close' },
        { id: 13, name: '已删除', number: '', icon: 'el-icon-delete' }
      ], // 菜单列表
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
      // 订单备注  弹框
      RemarksDialog: {
        id: 0,
        isShowDialog: false,
      },
      // 查看制衣单 弹框
      ClothingListDialog: {
        id: 0,
        isShowDialog: false,
      },
      // 制衣单流转 弹框
      ZYDLZDailog: {
        id: 0,
        isShowDialog: false,
      },
      // 查看布料物流 弹框
      FabricLogisticsDialog: {
        dialogType: "",
        id: 0,
        isShowDialog: false,
      },
      // 成衣发货 弹框
      ReadyWearSendDialog: {
        id: 0,
        isShowDialog: false,
      },
      // 下制衣单 弹框
      LowerGarmentListDialog: {
        id: 0,
        isShowDialog: false,
      },
      // 填充下制衣单数据 弹框
      LowerGarmentListEditDialog: {
        id: 0,
        isShowDialog: false,
      },
      // 打印 弹框
      PrintDialog: {
        id: 0,
        isShowDialog: false,
      },
      // 驳回审核 弹框
      RejectReviewtDialog: {
        id: 0,
        isShowDialog: false,
      },
      // 退回修改  弹框
      ReturnEditDialog: {
        id: 0,
        isShowDialog: false,
      },
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "等待工厂制造": 'danger',
        "等待提交门店": 'warning',
        "订单已取消": 'info',
        "订单完成": 'success',
        "定制": "warning",
        "成品": "success",
        "租赁": "danger",
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
        this.tableDataList = [
          {
            id: 1,
            Store: '北京店',
            ReceiptTime: '2023-07-20 10:49:36', // 收单时间
            paymentDate: '2023-07-20 10:49:36', // 付款日期
            OrderNumber: 'XXWXJ09979230720104936', // 订单号
            status: "等待工厂制造",
            tableData: [
              {
                id: 10001,
                orderNo: ' WZNJ09979230720104936-1', // 子订单号
                type: '定制', // 定制,成品，租赁
                status: '等待工厂制造', // 状态
                imgList: ['http://resource.vxiaocheng.com/dust/assets/img/suit_logo.png', 'http://resource.vxiaocheng.com/dust/assets/img/trousers_logo.png'],
                productName: '西服两件套',
                artNo: '', // 货号
                specifications: '', // 规格
                unitPrice: '10.00', // 单价
                number: '1', // 数量
                fabric: '世佳宝', // 面料
                factory: '邯郸工厂', // 工厂
                price: "869.00", // 总价
                customName: "张三丰",
                consultant: "张无忌",
              },
              {
                id: 10002,
                orderNo: ' WZNJ09979230720104936-1', // 子订单号
                type: '成品', // 定制,成品，租赁
                status: '等待工厂制造', // 状态
                imgList: ['http://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_27_11_11_29.02070.jpg'],
                productName: '西服两件套',
                artNo: 'xxwx0001', // 货号
                specifications: '红色 41', // 规格
                unitPrice: '10.00', // 单价
                number: '1', // 数量
                fabric: '世佳宝', // 面料
                factory: '邯郸工厂', // 工厂
                price: "869.00", // 总价
                customName: "张三丰",
                consultant: "张无忌",
              },
              {
                id: 10003,
                orderNo: ' WZNJ09979230720104936-1', // 子订单号
                type: '租赁', // 定制,成品，租赁
                status: '', // 状态
                imgList: ['http://resource.vxiaocheng.com/dust/assets/img/trousers_logo.png'],
                productName: '西服两件套',
                artNo: 'xxwx0001', // 货号
                specifications: '红色 41', // 规格
                unitPrice: '10.00', // 单价
                number: '1', // 数量
                fabric: '世佳宝', // 面料
                factory: '邯郸工厂', // 工厂
                price: "869.00", // 总价
                customName: "张三丰",
                consultant: "张无忌",
              }
            ],
            reject: '顾问提交订单，确认收款', // 审核原因
          },
          {
            id: 2,
            Store: '北京店',
            ReceiptTime: '2023-07-20 10:49:36', // 收单时间
            paymentDate: '2023-07-20 10:49:36', // 付款日期
            OrderNumber: 'XXWXJ09979230720104936', // 订单号
            status: "等待提交门店",
            tableData: [
              {
                id: 20001,
                orderNo: ' WZNJ09979230720104936-1', // 子订单号
                type: '租赁', // 定制,成品，租赁
                status: '', // 状态
                imgList: ['http://resource.vxiaocheng.com/dust/assets/img/trousers_logo.png'],
                productName: '西服两件套',
                artNo: 'xxwx0001', // 货号
                specifications: '红色 41', // 规格
                unitPrice: '10.00', // 单价
                number: '1', // 数量
                fabric: '世佳宝', // 面料
                factory: '邯郸工厂', // 工厂
                price: "869.00", // 总价
                customName: "张三丰",
                consultant: "张无忌",
              },
              {
                id: 20002,
                orderNo: ' WZNJ09979230720104936-1', // 子订单号
                type: '租赁', // 定制,成品，租赁
                status: '', // 状态
                imgList: ['http://resource.vxiaocheng.com/dust/assets/img/trousers_logo.png'],
                productName: '西服两件套',
                artNo: 'xxwx0001', // 货号
                specifications: '红色 41', // 规格
                unitPrice: '10.00', // 单价
                number: '1', // 数量
                fabric: '世佳宝', // 面料
                factory: '邯郸工厂', // 工厂
                price: "869.00", // 总价
                customName: "张三丰",
                consultant: "张无忌",
              }
            ],
            reject: '', // 审核原因
          },
        ]
        this.tableLoading = false;
      }, 500);

    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 设置跨行
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([2, 3, 4, 5].includes(columnIndex)) {
        if (columnIndex === 2) {
          return [1, 4];
        } else {
          return [0, 0];
        }
      } else {
        return [1, 1];
      }
    },
    // 二级表格设置跨行
    subTableArraySpanMethod({ row, column, rowIndex, columnIndex }, length) {
      if ([0, 1, 2].includes(columnIndex)) {
        if (columnIndex === 0) {
          return [1, 3];
        } else {
          return [0, 0];
        }
      } else if ([3, 4, 5].includes(columnIndex)) {
        if (rowIndex === 0) {
          return [length, 1];
        } else {
          return [0, 0];
        }
      } else {
        return [1, 1];
      }
    },
    // 查看详情
    searchDetail(row) {
      this.$router.push({ name: 'OrderDetails', params: { id: row.id } })
    },
    // 备注 打开弹框
    handleRemarks(row) {
      this.RemarksDialog.id = row.id;
      this.RemarksDialog.isShowDialog = true;
    },
    // 备注成功
    RemarksDialogSuccess() {
      this.initData()
    },
    // 查看制衣单  打开弹框
    handleSearchClothingList(row) {
      this.ClothingListDialog.id = row.id;
      this.ClothingListDialog.isShowDialog = true;
    },
    // 制衣单流转 打开弹框
    handleZYDLZ(row) {
      this.ZYDLZDailog.id = row.id;
      this.ZYDLZDailog.isShowDialog = true;
    },
    // 查看布料物流，布料发货  打开弹框
    handleSearchFabricLogistics(row, type) {
      this.FabricLogisticsDialog.dialogType = type == '查看' ? "look" : "edit";
      this.FabricLogisticsDialog.id = row.id;
      this.FabricLogisticsDialog.isShowDialog = true;
    },
    // 布料发货 成功
    FabricLogisticsDialogSuccess() {
      this.initData();
    },
    // 撤回制衣单
    handleWithdrawZYD(row) {
      this.$message.success('撤回成功')
      this.initData()
    },
    // 成衣发货   打开弹框
    handleCYFH(row) {
      this.ReadyWearSendDialog.id = row.id;
      this.ReadyWearSendDialog.isShowDialog = true;
    },
    // 成衣发货 成功
    ReadyWearSendDialogSuccess() {
      this.initData()
    },
    // 成衣发货 关闭弹框
    closeReadyWearSendDialogSuccess() { },

    // 下制衣单
    handleLowerGarmentList(row) {
      if (row.id === 10001) {
        this.LowerGarmentListDialog.id = row.id;
        this.LowerGarmentListDialog.isShowDialog = true;
      } else {
        this.$confirm('制衣单面料信息不完整, 请前往填充完整在下单', '面料信息提示', {
          confirmButtonText: '去填充',
          cancelButtonText: '再说吧',
          type: 'warning'
        }).then(() => {
          this.LowerGarmentListEditDialog.id = row.id;
          this.LowerGarmentListEditDialog.isShowDialog = true;
        }).catch(() => { });
      }
    },
    // 下制衣单 成功
    LowerGarmentListDialogSuccess() {
      this.initData();
    },
    // 编辑制衣数据 成功
    LowerGarmentListEditDialogSuccess() {
      this.initData();
    },
    // 打印订单
    handlePrint(row) {
      this.PrintDialog.id = row.id;
      this.PrintDialog.isShowDialog = true;
    },
    // 通过审核
    handleApproved(row) {
      this.$message.success('审核成功')
      this.initData()
    },
    // 驳回审核 打开弹框
    handleRejectReview(row) {
      this.RejectReviewtDialog.id = row.id;
      this.RejectReviewtDialog.isShowDialog = true;
    },
    // 驳回审核 成功
    RejectReviewtDialogSuccess() {
      this.initData()
    },
    // 退回修改 打开弹框
    handleReturnEdit(row) {
      this.ReturnEditDialog.id = row.id;
      this.ReturnEditDialog.isShowDialog = true;
    },
    // 退回修改 成功
    ReturnEditDialogSuccess() {
      this.initData()
    },
  }
}
</script>

<style lang="scss" scoped>
.tableMenuBtn {
  padding: 0 10px;
  background-color: #ffffff;
  margin-top: 15px;
  .el-tabs {
    ::v-deep .el-tabs__item {
      padding: 10px 20px;
      height: 50px;
    }
  }
}
.el-table-title-wrap {
  display: flex;
  justify-content: space-between;
  .lt {
    display: flex;
    gap: 20px;
  }
  .rt {
    display: flex;
    gap: 20px;
  }
}
.ClothingList_wrap {
  .cont {
    display: flex;
    justify-content: space-between;
    // align-items: center;
    .lf {
      display: flex;
      gap: 10px;
      .lf_l {
        .el-image {
          width: 80px;
          height: 80px;
        }
      }
      .lf_r {
        display: flex;
        flex-direction: column;
        .tit {
          font-size: 16px;
        }
      }
    }
    p {
      margin: 0;
    }
  }
  .flex-row-wrap {
    display: flex;
    gap: 10px;
  }
}
.subTable_foot_tips {
  padding: 10px;
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}
</style>

 