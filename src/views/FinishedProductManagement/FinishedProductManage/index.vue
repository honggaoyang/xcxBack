<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="类型" prop="product">
            <el-select v-model="searchForm.product" placeholder="类型">
              <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="searchForm.name" clearable placeholder="名称" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item label="货号" prop="artNo">
            <el-input v-model="searchForm.artNo" clearable placeholder="货号" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item label="面料号" prop="fabricNo">
            <el-input v-model="searchForm.fabricNo" clearable placeholder="面料号" @keyup.enter.native="initData"></el-input>
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
          </el-tabs>
          <el-button type="primary" @click="addProduct" icon="el-icon-plus">添加成品</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
          <el-table-column label="成品" min-width="250">
            <template slot-scope="{row}">
              <div class="product_wrap">
                <div>
                  <el-image :src="row.productImg" :preview-src-list="[row.productImg]"> </el-image>
                </div>
                <div>
                  <span>{{row.productName}}</span>
                  <div><el-tag type="info">货号：{{row.artNo}}</el-tag></div>
                  <div v-if="row.isSuit"><el-tag type="primary">套装</el-tag></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="面料" min-width="200">
            <template slot-scope="{row}">
              <el-tag v-if="row.fabricBrand" type="info">面料品牌：{{row.fabricBrand}}</el-tag>
              <el-tag v-if="row.fabricNo" type="info">面料号：{{row.fabricNo}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="规格(库存:本地/平台)" min-width="200">
            <template slot-scope="{row}">
              <div v-if="row.specifications.length>0">
                <el-tag v-for="speItem,index in row.specifications" :key="index" type="primary">{{speItem.color}} {{speItem.size}} - 库存：{{speItem.inventory}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="120">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="租赁" prop="lease" min-width="120" />
          <el-table-column label="销量" prop="sales" min-width="120" />
          <el-table-column label="价格（元）" prop="price" min-width="120" />
          <el-table-column label="成本价（元）" prop="cosePrice" min-width="120" />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" :width="activeMenuName=='上架中'?300:400">
            <template slot-scope="{row}">
              <el-button v-if="['上架中','已下架'].includes(activeMenuName)" icon="el-icon-edit" type="primary" @click="editProduct(row)">编辑</el-button>
              <el-button v-if="['上架中'].includes(activeMenuName)" icon="el-icon-bottom" type="danger" @click="handleDown(row)">下架</el-button>
              <el-dropdown v-if="['上架中'].includes(activeMenuName)" style="margin-left:10px" @command="warehousing($event,row)">
                <el-button type="warning">
                  库管<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="0">入库</el-dropdown-item>
                  <el-dropdown-item command="1">出库</el-dropdown-item>
                  <el-dropdown-item command="2">查看详情</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button v-if="['已下架'].includes(activeMenuName)" icon="el-icon-top" type="success" @click="handleUp(row)">上架</el-button>
              <el-button v-if="['已下架'].includes(activeMenuName)" icon="el-icon-delete" type="danger" @click="handleDel(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 出入库弹框 -->
    <el-dialog :title="warehouseDialog.title" top="8vh" :visible.sync="warehouseDialog.visible" width="750px" @closed="closeWarehouseDialog">
      <el-form label-width="auto">
        <el-form-item label="成品">{{warehouseDialog.diaData.finishProductName}}</el-form-item>
        <el-form-item label="货号">{{warehouseDialog.diaData.artNo}}</el-form-item>
        <el-form-item label="备注"><el-input clearable placeholder="备注" v-model="warehouseDialog.diaData.remarks"></el-input></el-form-item>
      </el-form>
      <el-table class="hhy-table" height="205" :data="warehouseDialog.diaData.tableData" stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column label="规格" prop="specifications"></el-table-column>
        <el-table-column label="货号" show-overflow-tooltip prop="artNo"></el-table-column>
        <el-table-column label="现有库存" prop="inventory"></el-table-column>
        <el-table-column label="数量">
          <template slot-scope="{row}">
            <el-input clearable placeholder="数量" v-model="row.number" maxlength="5" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="warehouseDialog.visible = false">取 消</el-button>
        <el-button :loading="warehouseDialog.submitLoading" type="primary" @click="handleWarehouse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FinishedProductManage",
  data() {
    return {
      productList: [{ id: 1, name: '全部' }, { id: 2, name: '上衣' }],
      searchForm: {
        product: 1, // 类型
        name: "", // 名称
        artNo: "", // 货号
        fabricNo: "", // 面料号
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
      // 出入库弹框相关
      warehouseDialog: {
        visible: false,
        title: "",
        submitLoading: false,
        diaData: {},
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "上架中": 'success',
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
            { id: 1, productImg: "https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_05_16_13_15_38.80620.jpg?x-oss-process=image/resize,w_200/quality,q_80", productName: "POLO衫经典款", artNo: "abdfe", isSuit: true, fabricBrand: "耐克", fabricNo: "066-920-06", specifications: [{ color: '蓝色', size: 41, inventory: '20 / 200' }, { color: '红色', size: 42, inventory: '133 / 235' }], status: "上架中", lease: '', sales: "", price: '9.34', cosePrice: '5.55' },
            { id: 2, productImg: "https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_06_16_10_16_32.54595.jpg?x-oss-process=image/resize,w_200/quality,q_80", productName: "POLO衫经典款", artNo: "abdfe", isSuit: true, fabricBrand: "耐克", fabricNo: "066-920-06", specifications: [{ color: '红色', size: 41, inventory: '20 / 200' }], status: "上架中", lease: '', sales: "", price: '9.34', cosePrice: '5.55' },
            { id: 3, productImg: "https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_05_16_13_15_38.80620.jpg?x-oss-process=image/resize,w_200/quality,q_80", productName: "POLO衫经典款", artNo: "abdfe", isSuit: false, fabricBrand: "耐克", fabricNo: "066-920-06", specifications: [{ color: '蓝色', size: 41, inventory: '20 / 200' }, { color: '红色', size: 42, inventory: '133 / 235' }], status: "上架中", lease: '', sales: "", price: '9.34', cosePrice: '5.55' },
          ]
        } else if (this.activeMenuName == '已下架') {
          DataList = [
            { id: 1, productImg: "https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_05_16_13_15_38.80620.jpg?x-oss-process=image/resize,w_200/quality,q_80", productName: "POLO衫经典款", artNo: "abdfe", isSuit: true, fabricBrand: "耐克", fabricNo: "066-920-06", specifications: [{ color: '蓝色', size: 41, inventory: '20 / 200' }, { color: '红色', size: 42, inventory: '133 / 235' }], status: "已下架", lease: '', sales: "", price: '9.34', cosePrice: '5.55' },
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
    // 新增
    addProduct() {
      this.$router.push({ name: 'AddFinishedProduct' })
    },
    // 编辑
    editProduct(row) {
      this.$router.push({ name: 'EditFinishedProduct', params: { id: row.id } })
    },
    // 下架
    handleDown(row) {
      this.$message.success("下架成功")
    },
    // 上架
    handleUp(row) {
      this.$message.success("上架成功")
    },
    // 删除
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
    // 出库 入库
    warehousing(index, row) {
      if (index == 0) {
        this.warehouseDialog.visible = true;
        this.warehouseDialog.title = "仓库入库";
        this.warehouseDialog.diaData = {
          finishProductName: "POLO衫经典款",
          artNo: "jdk01",
          remarks: "",
          tableData: [
            { id: 1, specifications: "黄色 41", artNo: "jdk01-01", inventory: 20, number: 0 },
            { id: 2, specifications: "黄色 42", artNo: "jdk01-02", inventory: 20, number: 0 },
            { id: 3, specifications: "黄色 43", artNo: "jdk01-03", inventory: 20, number: 0 },
          ]
        }
      } else if (index == 1) {
        this.warehouseDialog.visible = true;
        this.warehouseDialog.title = "仓库出库";
        this.warehouseDialog.diaData = {
          finishProductName: "POLO衫经典款",
          artNo: "jdk01",
          remarks: "",
          tableData: [
            { id: 1, specifications: "黄色 41", artNo: "jdk01-01", inventory: 20, number: 0 },
          ]
        }
      } else if (index == 2) {
        this.$router.push(`/FinishedProductManagement/EntryExitRecords?artNo=${row.artNo}`)
      }

    },
    // 关闭出库弹框
    closeWarehouseDialog() { },
    // 出入库点击确定按钮
    handleWarehouse() {
      this.warehouseDialog.submitLoading = true;
      setTimeout(() => {
        this.warehouseDialog.submitLoading = false;
        this.warehouseDialog.visible = false;
        this.$message.success((this.warehouseDialog.title.includes('入库') ? '入库' : '出库') + '成功')
      }, 500);
    },
  }
}
</script>


<style scoped lang="scss">
// 表格面料列样式
.product_wrap {
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
</style>