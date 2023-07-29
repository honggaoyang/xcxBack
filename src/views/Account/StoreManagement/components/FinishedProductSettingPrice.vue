<template>
  <div class="FinishedProductSettingPrice_wrap">
    <PageWrap class="FinishedProductSettingPrice_PageWrap">
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddReadyToWear">选择成衣</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+55" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" :index="indexMethod" />
          <el-table-column label="成衣" min-width="300" show-overflow-tooltip>
            <template slot-scope="{row}">
              <div class="FinishedProductSettingPrice_tableImgWrap">
                <div>
                  <el-image :src="row.img" :preview-src-list="[row.img]" />
                </div>
                <div>
                  <span>{{row.name}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="货号" prop="artNo" min-width="100" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-tag type="primary">{{row.artNo}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="原价">
            <template slot-scope="{row}">
              ￥ {{row.originalPrice}}
            </template>
          </el-table-column>
          <el-table-column label="现价">
            <template slot-scope="{row}">
              ￥ {{row.currentPrice}}
            </template>
          </el-table-column>
          <el-table-column label="调价幅度">
            <template slot-scope="{row}">
              ￥ {{row.settingPrice}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="{row}">
              <el-button icon="el-icon-setting" type="primary" @click="handleSettingPrice(row)">调价</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 添加成衣 弹框 -->
    <el-dialog title="添加成衣" top="8vh" :visible.sync="clothingDialog.visible" width="850px" @closed="closeClothingDialog">
      <div>
        <!-- 搜索框 -->
        <div class="clothingSearch_wrap">
          <div>
            <el-input placeholder="输入货号" @keyup.enter.native="getClothingData" clearable v-model="clothingDialog.gic">
              <el-button type="primary" slot="append" icon="el-icon-search" @click="getClothingData"></el-button>
            </el-input>
          </div>
          <span>选中{{currSelNumber}}件</span>
        </div>
        <div class="clothingCont_wrap" v-loading="clothingDialog.loading" element-loading-text="拼命加载中">
          <div class="item" :class="{active:item.isChecked}" @click="item.isChecked=!item.isChecked" v-for="item in clothingDialog.dataList" :key="item.id">
            <el-image :src="item.img" fit="cover"></el-image>
            <div class="text">
              <p>{{item.name}}</p>
              <p>货号：{{item.artNo}}</p>
            </div>
          </div>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>

      <span slot="footer">
        <el-button @click="clothingDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitSelClothingData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 调价弹框 -->
    <el-dialog title="调价" :visible.sync="SettingPriceDialog.visible" width="450px" @closed="closeSettingPriceDialog">
      <el-form ref="SettingPriceDialogRef" :model="SettingPriceDialog.Form" :rules="SettingPriceDialog.Rules" label-width="100px">
        <el-form-item label="套装原价" prop="originalPrice">
          <div class="flex_wrap">
            <el-input maxlength="8" v-model="SettingPriceDialog.Form.originalPrice" clearable placeholder="请输入套装原价" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input><span>元</span>
          </div>
        </el-form-item>
        <el-form-item label="套装现价" prop="currentPrice">
          <div class="flex_wrap">
            <el-input maxlength="8" v-model="SettingPriceDialog.Form.currentPrice" clearable placeholder="请输入套装现价" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input><span>元</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="SettingPriceDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitSettingPrice('SettingPriceDialogRef')">确 定</el-button>
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
      // 添加成衣弹框
      clothingDialog: {
        visible: false,
        gic: "", // 搜索内容
        loading: false,
        dataList: [],
      },
      // 调价弹框
      SettingPriceDialog: {
        visible: false,
        Form: {
          originalPrice: "",
          currentPrice: "",
        },
        Rules: {
          currentPrice: [
            { required: true, message: '请输入套装现价', trigger: 'blur' },
          ],
        },
      }
    }
  },
  computed: {
    // 获取添加成衣弹框里面选中的数据
    currSelNumber() {
      return this.clothingDialog.dataList.filter(v => v.isChecked).length
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
          { id: 1, img: 'http://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_05_16_13_15_38.80620.jpg', name: 'POLO衫经典款', artNo: 'xxwx0001', originalPrice: '200.00', currentPrice: '567.00', settingPrice: "0.00" },
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 添加成衣
    handleAddReadyToWear() {
      this.clothingDialog.visible = true;
      this.getClothingData();
    },
    // 获取成衣弹框数据
    getClothingData() {
      this.clothingDialog.dataList = [];
      this.clothingDialog.loading = true;
      setTimeout(() => {
        this.clothingDialog.dataList = [
          { id: 1, img: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, originalPrice: '200.00', currentPrice: '567.00', settingPrice: "0.00", name: '修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 2, img: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, originalPrice: '200.00', currentPrice: '567.00', settingPrice: "0.00", name: '修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 3, img: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, originalPrice: '200.00', currentPrice: '567.00', settingPrice: "0.00", name: '修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 4, img: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, originalPrice: '200.00', currentPrice: '567.00', settingPrice: "0.00", name: '修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 5, img: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, originalPrice: '200.00', currentPrice: '567.00', settingPrice: "0.00", name: '修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 6, img: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, originalPrice: '200.00', currentPrice: '567.00', settingPrice: "0.00", name: '修身西服2023春季新款', artNo: 'xsxfcjxk' }
        ];
        this.clothingDialog.loading = false;
      }, 500);
    },
    // 成衣弹框 确定
    submitSelClothingData() {
      let selList = this.clothingDialog.dataList.filter(v => v.isChecked)
      selList.forEach((v) => {
        this.tableDataList.push(v)
      })
      this.clothingDialog.visible = false
    },
    // 关闭成衣弹框
    closeClothingDialog() {

    },
    // 调价弹框 打开
    handleSettingPrice(row) {
      this.SettingPriceDialog.Form = {
        originalPrice: row.originalPrice,
        currentPrice: row.currentPrice,
      }
      this.SettingPriceDialog.visible = true;
    },
    // 调价弹框 点击确定
    handleSubmitSettingPrice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.SettingPriceDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 调价弹框 关闭
    closeSettingPriceDialog() {
      this.$refs['SettingPriceDialogRef'].resetFields();
      this.SettingPriceDialog.Form = {
        originalPrice: "",
        currentPrice: "",
      }
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
.FinishedProductSettingPrice_wrap {
  height: calc(100vh - 84px - 50px - 90px - 75px);
}

.FinishedProductSettingPrice_PageWrap {
  .hhy-card {
    padding: 0;
    margin: 0;
  }
}

.FinishedProductSettingPrice_tableImgWrap {
  display: flex;
  gap: 5px;
  justify-content: center;
  .el-image {
    width: 50px;
    height: 50px;
  }
}

.flex_wrap {
  display: flex;
  gap: 10px;
  .el-input {
    width: 200px;
  }
}

// 成衣弹框搜索
.clothingSearch_wrap {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  span {
    margin-left: 15px;
  }
}
// 成衣弹框内容
.clothingCont_wrap {
  height: 300px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding-right: 20px;
  .item {
    width: 180px;
    height: auto;
    border: 1px solid #dedede;
    overflow: hidden;
    cursor: pointer;
    .el-image {
      width: 180px;
      height: 200px;
    }
    .text {
      p {
        padding: 10px;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis;
        &:nth-child(2) {
          padding-top: 0;
        }
      }
    }
  }
  i {
    width: 180px;
  }
  .item.active {
    border: 1px solid #409eff;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      border: 25px solid #409eff;
      border-top-color: transparent;
      border-left-color: transparent;
    }
    &::after {
      content: "";
      width: 10px;
      height: 20px;
      position: absolute;
      right: 8px;
      bottom: 8px;
      border: 2px solid #fff;
      border-top-color: transparent;
      border-left-color: transparent;
      transform: rotate(45deg);
    }
  }
}
</style>