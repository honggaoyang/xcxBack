<template>
  <div class="FabricSettingPrice_wrap">
    <!-- 表格顶部操作 -->
    <el-button type="primary" class="FabricSettingPrice_topMenuBtn" @click="handleSelFabric" icon="el-icon-plus">选择面料</el-button>
    <!-- 表格 -->
    <el-table v-loading="tableLoading" class="hhy-table" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
      <!-- 序号 -->
      <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
      <el-table-column label="面料" min-width="200" show-overflow-tooltip>
        <template slot-scope="{row}">
          <div class="FabricSettingPrice_tableImgWrap">
            <div>
              <el-image :src="row.img" :preview-src-list="[row.img]" />
            </div>
            <div>
              <span>{{row.name}}</span>
              <div>
                <el-tag>品牌：{{row.brand}}</el-tag>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="价格" min-width="300">
        <template slot-scope="{row}">
          <el-table :data="row.priceList" height="250" border>
            <el-table-column prop="name" label="服装" width="200">
            </el-table-column>
            <el-table-column prop="originalPrice" label="原定制价">
            </el-table-column>
            <el-table-column prop="currentPrice" label="现定制价">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="{row}">
          <el-button icon="el-icon-setting" type="primary" @click="handleSettingPrice(row)">调价</el-button>
          <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <myPagination :pager="pager" @query="initData" />

    <!-- 选择面料 弹框 -->
    <el-dialog title="选择面料" top="8vh" :visible.sync="SelFabricDialog.visible" width="850px" @closed="closeSelFabricDialog">
      <!-- 搜索框 -->
      <div class="SelFabricSearch">
        <el-input placeholder="输入面料号" @keyup.enter.native="getFabricList" clearable v-model="SelFabricDialog.Search">
          <el-button type="primary" slot="append" icon="el-icon-search" @click="getFabricList"></el-button>
        </el-input>
      </div>
      <!-- 表格 -->
      <el-table v-loading="SelFabricDialog.tableLoading" height="350px" class="hhy-table" :data="SelFabricDialog.TableList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
        <el-table-column type="index" label="序号" :index="selFabricIndexMethod" />
        <el-table-column label="面料" show-overflow-tooltip>
          <template slot-scope="{row}">
            <div class="SelFabric_fabric_wrap">
              <div>
                <el-image :src="row.img" :preview-src-list="[row.img]" />
              </div>
              <div>
                <span>{{row.name}}</span>
                <div>
                  <el-tag>品牌：{{row.brand}}</el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{row}">
            <el-tag effect="dark" :type="row.Status | statusFilter">{{row.Status}}</el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="{row}">
            <el-button :loading="submitLoading" icon="el-icon-check" type="primary" @click="handleSubmitSelFabric(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <myPagination :pager="SelFabricDialog.pager" @query="getFabricList" />
    </el-dialog>

    <!-- 面料调价 -->
    <el-dialog title="面料调价" top="8vh" :visible.sync="FabricSettingPriceDialog.visible" width="650px" @closed="closeFabricSettingPriceDialog">
      <el-table v-loading="FabricSettingPriceDialog.tableLoading" height="350px" class="hhy-table" :data="FabricSettingPriceDialog.TableList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
        :cell-style="{textAlign: 'center'}">
        <el-table-column type="index" label="序号" :index="selFabricIndexMethod" />
        <el-table-column label="服装" prop="name" show-overflow-tooltip />
        <el-table-column label="定制价">
          <template slot-scope="{row}">
            ￥ {{row.CustomPrice}}
          </template>
        </el-table-column>
        <el-table-column label="调整定制价">
          <template slot-scope="{row}">
            <el-input maxlength="8" v-model="row.settingCustomPrice" placeholder="输入调整定制价" clearable oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="FabricSettingPriceDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitSettingPrice">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      submitLoading: false,
      tableLoading: false,
      tableDataList: [],
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },
      // 选择面料弹框
      SelFabricDialog: {
        visible: false,
        Search: "",
        tableLoading: false,
        TableList: [],
        pager: {
          count: 50,
          page: 1,
          rows: 15,
          checkNum: 0,
        },
      },
      // 面料调价弹框
      FabricSettingPriceDialog: {
        visible: false,
        tableLoading: false,
        TableList: [],
      },
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
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { id: 1, img: 'http://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_05_16_13_15_38.80620.jpg', name: 'POLO衫经典款', brand: '啄木鸟啄木鸟', priceList: [{ name: '制服四件套', originalPrice: '7801.20', currentPrice: '-' }, { name: '西服', originalPrice: '1000.20', currentPrice: '-' }, { name: '马甲', originalPrice: '7801.20', currentPrice: '-' }, { name: '大衣', originalPrice: '801.20', currentPrice: '-' }, { name: '夹克', originalPrice: '7301.20', currentPrice: '-' }, { name: '女短裙', originalPrice: '801.20', currentPrice: '-' }, { name: '休闲裤', originalPrice: '1001.20', currentPrice: '-' }, { name: '制服四件套', originalPrice: '7801.20', currentPrice: '-' }, { name: '制服四件套', originalPrice: '7801.20', currentPrice: '-' }, { name: '制服四件套', originalPrice: '7801.20', currentPrice: '-' }] },
          { id: 2, img: 'http://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_05_16_13_15_38.80620.jpg', name: 'POLO衫经典款', brand: '啄木鸟啄木鸟', priceList: [{ name: '制服四件套', originalPrice: '7801.20', currentPrice: '-' }, { name: '西服', originalPrice: '1000.20', currentPrice: '-' }, { name: '马甲', originalPrice: '7801.20', currentPrice: '-' }, { name: '大衣', originalPrice: '801.20', currentPrice: '-' }, { name: '夹克', originalPrice: '7301.20', currentPrice: '-' }, { name: '女短裙', originalPrice: '801.20', currentPrice: '-' }] },
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },

    // 选择表格每隔一页递增
    selFabricIndexMethod(index) {
      return (this.SelFabricDialog.pager.page - 1) * this.SelFabricDialog.pager.rows + index + 1;
    },
    // 选择面料弹框 点击确定面料按钮
    handleSelFabric() {
      this.SelFabricDialog.visible = true;
      this.getFabricList();
    },
    // 选择面料弹框 获取面料列表
    getFabricList() {
      this.SelFabricDialog.tableLoading = true;
      setTimeout(() => {
        this.SelFabricDialog.TableList = [
          { id: 1, img: 'http://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_05_16_13_15_38.80620.jpg', name: 'POLO衫经典款', brand: '啄木鸟啄木鸟', Status: '上架中', priceList: [{ name: '制服四件套', originalPrice: '7801.20', currentPrice: '-' }, { name: '西服', originalPrice: '1000.20', currentPrice: '-' }, { name: '马甲', originalPrice: '7801.20', currentPrice: '-' }] },
          { id: 2, img: 'http://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_05_16_13_15_38.80620.jpg', name: 'POLO衫经典款', brand: '啄木鸟啄木鸟', Status: '已下架', priceList: [{ name: '制服四件套', originalPrice: '7801.20', currentPrice: '-' }, { name: '西服', originalPrice: '1000.20', currentPrice: '-' }, { name: '马甲', originalPrice: '7801.20', currentPrice: '-' }] },
        ]
        this.SelFabricDialog.tableLoading = false;
      }, 500);
    },
    // 选择面料弹框 点击选择按钮
    handleSubmitSelFabric(row) {
      this.submitLoading = true;
      setTimeout(() => {
        this.tableDataList.push(row);
        this.submitLoading = false;
      }, 500);
      this.SelFabricDialog.visible = false;
    },
    // 选择面料弹框 关闭
    closeSelFabricDialog() {
      this.SelFabricDialog.TableList = [];
      this.SelFabricDialog.Search = "";
      // 重新获取列表
      // this.initData();
    },

    // 面料调价弹框 打开
    handleSettingPrice() {
      this.FabricSettingPriceDialog.visible = true;
      this.FabricSettingPriceDialog.tableLoading = true;
      setTimeout(() => {
        this.FabricSettingPriceDialog.TableList = [
          { id: 1, name: '制服四件套', CustomPrice: '7801.20', settingCustomPrice: '' },
          { id: 2, name: '西服两件套', CustomPrice: '401.20', settingCustomPrice: '' },
          { id: 3, name: '西服三件套	', CustomPrice: '101.20', settingCustomPrice: '' },
          { id: 4, name: '西服', CustomPrice: '211.20', settingCustomPrice: '' },
          { id: 5, name: '西裤', CustomPrice: '781.20', settingCustomPrice: '' },
          { id: 6, name: '马甲', CustomPrice: '731.20', settingCustomPrice: '' },
          { id: 7, name: '大衣', CustomPrice: '7231.20', settingCustomPrice: '' },
          { id: 8, name: '衬衫', CustomPrice: '21201.20', settingCustomPrice: '' },
          { id: 9, name: '女裙', CustomPrice: '8701.20', settingCustomPrice: '' },
          { id: 10, name: '女短裙', CustomPrice: '1101.20', settingCustomPrice: '' },
        ];
        this.FabricSettingPriceDialog.tableLoading = false;
      }, 500);

    },
    // 面料调价弹框 点击确定按钮
    handleSubmitSettingPrice() {
      this.submitLoading = true;
      setTimeout(() => {
        this.submitLoading = false;
        this.FabricSettingPriceDialog.visible = false;
      }, 500);
    },
    // 面料调价弹框 关闭
    closeFabricSettingPriceDialog() {
      this.FabricSettingPriceDialog.TableList = [];
    },

    // 删除
    handleDelete(row) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        this.initData();
      }).catch(() => { });
    },
  }
}
</script>

<style lang="scss">
.FabricSettingPrice_topMenuBtn {
  margin-bottom: 15px;
}
.FabricSettingPrice_tableImgWrap {
  display: flex;
  gap: 5px;
  justify-content: center;
  div {
    text-align: left;
    &:nth-child(1) {
      .el-image {
        width: 50px;
        height: 50px;
      }
    }
  }
}

// 选择面料弹框
.SelFabricSearch {
  width: 300px;
  margin-bottom: 15px;
}
.SelFabric_fabric_wrap {
  display: flex;
  gap: 5px;
  justify-content: center;
  div {
    text-align: left;
    &:nth-child(1) {
      .el-image {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>