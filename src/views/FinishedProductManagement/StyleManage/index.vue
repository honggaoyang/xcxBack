<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="编号" prop="number">
            <el-input v-model="searchForm.number" clearable placeholder="编号" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="product">
            <el-select v-model="searchForm.product" placeholder="类型">
              <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
          <el-tabs v-model="activeMenuName" @tab-click="handleMenuClick">
            <el-tab-pane label="上架中" name="上架中"></el-tab-pane>
            <el-tab-pane label="已下架" name="已下架"></el-tab-pane>
          </el-tabs>
          <el-button type="primary" @click="addStyle" icon="el-icon-plus">添加款式</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
          <el-table-column label="款式">
            <template slot-scope="{row}">
              <div class="fabric_wrap">
                <div>
                  <el-image :src="row.FabricImg" :preview-src-list="[row.FabricImg]"> </el-image>
                </div>
                <div>
                  <span>{{row.styleName}}</span>
                  <div><el-tag type="info">编号:{{row.number}}</el-tag></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="使用范围" prop="range" />
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" :width="activeMenuName=='上架中'?200:400">
            <template slot-scope="{row}">
              <el-button v-if="['上架中','已下架'].includes(activeMenuName)" icon="el-icon-edit" type="primary" @click="editStyle(row)">编辑</el-button>
              <el-button v-if="['上架中'].includes(activeMenuName)" icon="el-icon-bottom" type="danger" @click="handleDown(row)">下架</el-button>
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

    <!-- 新增编辑弹框 -->
    <Dialog :dialog-type="dialogOption.dialogType" :is-show.sync="dialogOption.isShowDialog" @success="dialogSuccess" @closed="closeDialog" />
  </div>
</template>

<script>
import Dialog from './components/Dialog.vue'
export default {
  name: 'StyleManage',
  components: { Dialog },
  data() {
    return {
      productList: [{ id: 1, name: '全部' }, { id: 2, name: '上衣' }],
      searchForm: {
        number: "", // 编号
        product: 1, // 类型
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

      // 弹框相关
      dialogOption: {
        dialogType: "",  // 弹框类型，新增，编辑
        isShowDialog: false, // 是否显示弹框
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
            { id: 1, FabricImg: "https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg", styleName: "单排扣无驳头头1", number: "123", range: "上衣", status: "上架中" },
            { id: 2, FabricImg: "https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg", styleName: "单排扣无驳头头2", number: "345", range: "上衣", status: "上架中" },
            { id: 3, FabricImg: "https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg", styleName: "单排扣无驳头头3", number: "67986", range: "上衣", status: "上架中" }
          ]
        } else if (this.activeMenuName == '已下架') {
          DataList = [
            { id: 1, FabricImg: "https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg", styleName: "单排扣无驳头头1", number: "123", range: "上衣", status: "已下架" },
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
    addStyle() {
      this.dialogOption.dialogType = "add"
      this.dialogOption.isShowDialog = true;
    },
    // 编辑款式
    editStyle(row) {
      this.dialogOption.dialogType = "edit"
      this.dialogOption.isShowDialog = true;
    },
    // 弹框点击确定按钮成功回调
    dialogSuccess() {
      this.initData();
    },
    // 弹框关闭回掉
    closeDialog() {

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
    }
  }
}
</script>

<style scoped lang="scss">
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
</style>