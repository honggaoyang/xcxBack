<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="面料分类" prop="FabricClass">
            <el-select v-model="searchForm.FabricClass" placeholder="面料分类">
              <el-option v-for="item in FabricClassList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="纹路" prop="lines">
            <el-select v-model="searchForm.lines" placeholder="纹路">
              <el-option v-for="item in linesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="颜色" prop="color">
            <el-select v-model="searchForm.color" placeholder="颜色">
              <el-option v-for="item in colorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="面料品牌" prop="FabricBrand">
            <el-select v-model="searchForm.FabricBrand" placeholder="面料品牌">
              <el-option v-for="item in FabricBrandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="面料商" prop="FabricMerchant">
            <el-select v-model="searchForm.FabricMerchant" placeholder="面料商">
              <el-option v-for="item in FabricMerchantList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="面料号" prop="FabricNumber">
            <el-input v-model="searchForm.FabricNumber" clearable placeholder="面料号" @keyup.enter.native="initData"></el-input>
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
            <el-tab-pane label="上架中" name="上架中"></el-tab-pane>
            <el-tab-pane label="已下架" name="已下架"></el-tab-pane>
            <el-tab-pane label="面料池" name="面料池"></el-tab-pane>
          </el-tabs>
          <el-button type="primary" @click="addFabric" icon="el-icon-plus">添加面料</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
          <el-table-column label="面料" min-width="200">
            <template slot-scope="{row}">
              <div class="fabric_wrap">
                <div>
                  <el-image :src="row.FabricImg" :preview-src-list="[row.FabricImg]"> </el-image>
                </div>
                <div>
                  <span>{{row.FabricName}}</span>
                  <div><el-tag type="info">{{row.color}}</el-tag></div>
                  <div><el-tag type="info">{{row.lines}}</el-tag></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="120">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="品牌" min-width="120" show-overflow-tooltip prop="brand" />
          <el-table-column label="面料商" min-width="120" show-overflow-tooltip prop="FabricMerchant" />
          <el-table-column label="价格" min-width="120">
            <template slot-scope="{row}">
              <div class="price_wrap" v-if="['上架中','已下架'].includes(activeMenuName)">
                结算价：¥
                <el-popover popper-class="fabricManagement_price_popper" placement="top" width="250" trigger="hover">
                  <div class="content">
                    <span>定制价</span>
                    <div>西服: ¥ 6593.40</div>
                  </div>
                  <el-link @click="settingFabricPrice(row)" slot="reference" type="primary">{{row.price}}</el-link>
                </el-popover>
              </div>
              <div v-if="activeMenuName == '面料池'">
                结算价：¥ {{row.price}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="用料(米)" min-width="120" show-overflow-tooltip prop="materialsUsed" />
          <el-table-column label="下单次数" min-width="120" show-overflow-tooltip prop="orderNum" />
          <el-table-column label="库存(米)" min-width="120" show-overflow-tooltip prop="inventory" />
          <el-table-column label="添加时间" min-width="160" show-overflow-tooltip prop="date" />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" :width="activeMenuName=='面料池'?200:400">
            <template slot-scope="{row}">
              <el-button v-if="['上架中','已下架'].includes(activeMenuName)" icon="el-icon-document" type="success" @click="handleUsageRecord(row)">使用记录</el-button>
              <el-button v-if="['上架中','已下架'].includes(activeMenuName)" icon="el-icon-edit" type="warning" @click="editFabric(row)">编辑</el-button>
              <el-button v-if="['上架中','面料池','已下架'].includes(activeMenuName)" icon="el-icon-search" type="primary" @click="searchFabric(row)">查看</el-button>
              <el-button v-if="['上架中'].includes(activeMenuName)" icon="el-icon-bottom" type="danger" @click="handleDown(row)">下架</el-button>
              <el-button v-if="['已下架'].includes(activeMenuName)" icon="el-icon-top" type="danger" @click="handleUp(row)">上架</el-button>
              <el-button v-if="['面料池'].includes(activeMenuName)" icon="el-icon-check" type="success" @click="handleSelUse(row)">选用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 调整面料价格弹框 -->
    <el-dialog title="调整面料价格" class="settingFabricPriceDialog" :visible.sync="settingFabricPriceDialog.visible" width="450px" @closed="closeSettingFabricPriceDialog">
      <el-form :model="settingFabricPriceDialog.Form" :rules="settingFabricPriceDialog.Rules" ref="settingFabricPriceRef" label-width="100px">
        <el-form-item label="成本价" class="item" prop="costPrice">
          <el-input placeholder="输入成本价" v-model="settingFabricPriceDialog.Form.costPrice" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input><span>元 / 米</span>
        </el-form-item>
        <el-form-item label="计价基础价" class="item" prop="basisPrice">
          <el-input placeholder="输入计价基础价" v-model="settingFabricPriceDialog.Form.basisPrice" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input><span>元</span>
        </el-form-item>
        <el-form-item label="定制价格">
          <div class="customizedPrice">
            <span>西服</span><span>¥ 3697.65</span>
          </div>
        </el-form-item>
        <el-form-item label="库存" class="item" prop="inventory" v-if="settingFabricPriceDialog.currOpenBtnName=='选用'">
          <el-input placeholder="输入库存" v-model="settingFabricPriceDialog.Form.inventory" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input><span>米</span>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="settingFabricPriceDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitSettingFabricPrice('settingFabricPriceRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 使用记录弹框 -->
    <el-dialog title="用料记录" :visible.sync="usageRecordDialog.visible" width="750px" @closed="closeUsageRecordDialog">
      <el-table v-loading="usageRecordDialog.loading" height="350px" class="hhy-table" :data="usageRecordDialog.tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column type="index" label="序号" />
        <el-table-column label="订单" show-overflow-tooltip>
          <template slot-scope="{row}">
            <router-link :to="{name:'OrderManagement',query:{orderID:row.orderNum}}" target="_blank">
              <el-link type="primary">{{row.orderNum}}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="用料" prop="MaterialsUsed"></el-table-column>
        <el-table-column label="时间" prop="date"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增编辑查看弹框 -->
    <el-dialog :title="addEditSearchDialog.title" class="" :visible.sync="addEditSearchDialog.visible" width="900px" @closed="closeAddEditSearchDialog">
      <div style="height:400px;overflow:auto">
        <Form v-if="addEditSearchDialog.visible" ref="FormRef" @submitSuccess="submitSuccess" :title="addEditSearchDialog.title" :row="addEditSearchDialog.row" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Form from './components/Form'
export default {
  name: 'FabricManagement',
  components: { Form },
  data() {
    return {
      // 面料分类 列表
      FabricClassList: [{ id: 1, name: '全部' }, { id: 2, name: '面料分类' }],
      // 纹路 列表
      linesList: [{ id: 1, name: '全部' }, { id: 2, name: '纹路' }],
      // 颜色 列表
      colorList: [{ id: 1, name: '全部' }, { id: 2, name: '颜色' }],
      // 面料品牌 列表
      FabricBrandList: [{ id: 1, name: '全部' }, { id: 2, name: '面料品牌' }],
      // 面料商 列表
      FabricMerchantList: [{ id: 1, name: '全部' }, { id: 2, name: '面料商' }],
      searchForm: {
        FabricClass: 1, // 面料分类
        lines: 1, // 纹路
        color: 1, // 颜色
        FabricBrand: 1, // 面料品牌
        FabricMerchant: 1, // 面料商
        FabricNumber: "", // 面料号
      },
      activeMenuName: "上架中", // 选中菜单
      tableLoading: false, // table 加载状态
      tableDataList: [],
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },

      submitLoading: false,// 提交按钮加载状态

      // 上架中-调整面料价格弹框相关
      settingFabricPriceDialog: {
        visible: false,
        currOpenBtnName: "", // 当前打开弹框名称
        Form: {
          costPrice: "", // 成本价
          basisPrice: "", // 计价基础价 
          inventory: "", // 库存
        },
        Rules: {
          costPrice: [
            { required: true, message: '请输入成本价', trigger: 'blur' },
          ],
          basisPrice: [
            { required: true, message: '请输入计价基础价', trigger: 'blur' },
          ],
          inventory: [
            { required: true, message: '请输入库存', trigger: 'blur' },
          ]
        },

      },

      // 使用记录弹框
      usageRecordDialog: {
        visible: false,
        loading: false,
        tableDataList: [],
      },

      // 新增编辑查看弹框 
      addEditSearchDialog: {
        visible: false,
        title: "",
        row: {},
      },

    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "上架中": 'success',
        "待选用": 'warning',
        "已下架": 'info',
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
        if (this.activeMenuName == '上架中') {
          DataList = [
            { id: 1, FabricImg: "https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg", FabricName: "WL2233054", lines: "凹陷", color: "黑色", status: "上架中", brand: "世佳宝", FabricMerchant: "北京工厂", price: "100", materialsUsed: "12.33", orderNum: "50", inventory: "1000", date: "2023-07-02 15:53:36" },
            { id: 2, FabricImg: "https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg", FabricName: "WL2233054", lines: "凹陷", color: "黑色", status: "上架中", brand: "世佳宝", FabricMerchant: "北京工厂", price: "100", materialsUsed: "12.33", orderNum: "50", inventory: "1000", date: "2023-07-02 15:53:36" },
            { id: 3, FabricImg: "https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg", FabricName: "WL2233054", lines: "凹陷", color: "黑色", status: "上架中", brand: "世佳宝", FabricMerchant: "北京工厂", price: "100", materialsUsed: "12.33", orderNum: "50", inventory: "1000", date: "2023-07-02 15:53:36" }
          ]
        } else if (this.activeMenuName == '已下架') {
          DataList = [
            { id: 1, FabricImg: "https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg", FabricName: "WL2233054", lines: "凹陷", color: "黑色", status: "已下架", brand: "世佳宝", FabricMerchant: "北京工厂", price: "100", materialsUsed: "12.33", orderNum: "50", inventory: "1000", date: "2023-07-02 15:53:36" },
          ]
        } else if (this.activeMenuName == '面料池') {
          DataList = [
            { id: 1, FabricImg: "https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg", FabricName: "WL2233054", lines: "凹陷", color: "黑色", status: "待选用", brand: "世佳宝", FabricMerchant: "北京工厂", price: "100", materialsUsed: "12.33", orderNum: "50", inventory: "1000", date: "2023-07-02 15:53:36" },
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

    // 上架中-打开调整面料价格弹框
    settingFabricPrice(row) {
      this.settingFabricPriceDialog.visible = true;
    },
    // 上架中-保存调整面料价格弹框
    handleSubmitSettingFabricPrice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.submitLoading = false;
            this.settingFabricPriceDialog.visible = false;
            this.$message.success('操作成功')
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 上架中-关闭调整面料价格弹框
    closeSettingFabricPriceDialog() {
      this.$refs.settingFabricPriceRef.resetFields();
      this.settingFabricPriceDialog.currOpenBtnName = "";
    },

    // 点击使用记录按钮
    handleUsageRecord(row) {
      this.usageRecordDialog.visible = true;
      this.usageRecordDialog.loading = true;
      setTimeout(() => {
        this.usageRecordDialog.tableDataList = [
          { id: 1, orderNum: "WZNJ09882230711164208-1", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
          { id: 2, orderNum: "WZNJ09882230711164208-2", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
          { id: 3, orderNum: "WZNJ09882230711164208-3", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
          { id: 4, orderNum: "WZNJ09882230711164208-4", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
          { id: 5, orderNum: "WZNJ09882230711164208-5", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
          { id: 6, orderNum: "WZNJ09882230711164208-5", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
          { id: 7, orderNum: "WZNJ09882230711164208-5", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
          { id: 8, orderNum: "WZNJ09882230711164208-5", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
          { id: 9, orderNum: "WZNJ09882230711164208-5", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
          { id: 10, orderNum: "WZNJ09882230711164208-5", MaterialsUsed: "30 cm", date: "2023-07-18 12:12:12" },
        ]
        this.usageRecordDialog.loading = false;
      }, 500);

    },
    // 关闭使用记录弹框
    closeUsageRecordDialog() {
      this.usageRecordDialog.tableDataList = [];
    },
    // 添加面料 
    addFabric() {
      this.addEditSearchDialog.title = "新增";
      this.addEditSearchDialog.visible = true;
    },
    // 编辑面料
    editFabric(row) {
      this.addEditSearchDialog.title = "编辑";
      this.addEditSearchDialog.visible = true;
      this.addEditSearchDialog.row = row;
    },
    // 编辑面料
    searchFabric(row) {
      this.addEditSearchDialog.title = "查看";
      this.addEditSearchDialog.visible = true;
      this.addEditSearchDialog.row = row;
    },
    // 新增编辑成功
    submitSuccess() {
      this.addEditSearchDialog.visible = false;
      this.initData();
    },
    // 关闭新增编辑查看弹框
    closeAddEditSearchDialog() {
      this.addEditSearchDialog.row = {}
    },
    // 下架
    handleDown(row) {
      this.$message.success("下架成功")
    },
    // 上架
    handleUp(row) {
      this.$message.success("上架成功")
    },
    // 选用
    handleSelUse(row) {
      this.settingFabricPriceDialog.currOpenBtnName = "选用"
      this.settingFabricPriceDialog.visible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
// 表格面料列样式
.fabric_wrap {
  display: flex;
  gap: 10px;
  .el-image {
    width: 80px;
    height: 80px;
  }
  > div {
    &:nth-child(2) {
      text-align: left;
      span {
        display: inline-block;
        margin-bottom: 5px;
      }
    }
  }
}

// 调整面料价格弹框
.settingFabricPriceDialog {
  .item {
    ::v-deep.el-form-item__content {
      display: flex;
      span {
        width: 100px;
        padding-left: 10px;
      }
    }
  }
  .customizedPrice {
    display: flex;
    gap: 10px;
  }
}
</style>
<style>
/* 表格价格列hover弹框样式 */
.fabricManagement_price_popper {
  padding: 0;
}
.fabricManagement_price_popper .content span {
  padding: 15px;
  display: inline-block;
  font-weight: bold;
}
.fabricManagement_price_popper .content div {
  border-top: 1px solid #dedede;
  padding: 15px;
}
</style>