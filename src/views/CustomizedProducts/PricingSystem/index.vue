<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-tabs v-model="activeMenuName" @tab-click="handleMenuClick">
            <el-tab-pane v-for="item in MenuList" :key="item.id" :label="item.name" :name="item.name"></el-tab-pane>
          </el-tabs>
          <div class="topMenuBtn">
            <div>
              <el-button type="primary" icon="el-icon-plus" @click="handleAddPriceRangeDialog">添加价格区间</el-button>
              <el-button type="primary" icon="el-icon-setting" @click="handleOpenBatchChangePrice">批量调价</el-button>
              <el-button type="primary" icon="el-icon-coin" @click="handleOpenSyncPrice">同步价格</el-button>
            </div>
            <div>
              <el-link @click="$router.push('/CustomizedProducts/CustomizedProducts')" type="primary">管理定制产品<i class="el-icon-right el-icon--right"></i> </el-link>
            </div>
          </div>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+30" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="价格区间" prop="PriceRange"></el-table-column>
          <el-table-column label="定制价">
            <template slot-scope="{row}">
              ￥ {{row.CustomizedPrice}}
            </template>
          </el-table-column>
          <el-table-column label="最后更新" prop="LastUpdateTime"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="primary" @click="handleEditPriceRangeDialog(row)">编辑</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageWrap>

    <!-- 添加编辑价格区间 -->
    <el-dialog :title="PriceRangeDialog.title" :visible.sync="PriceRangeDialog.visible" width="450px" @closed="closePriceRangeDialog">
      <el-form ref="PriceRangeFormRef" :model="PriceRangeDialog.Form" :rules="PriceRangeDialog.Rules" label-width="110px">
        <el-form-item label="起始价(超过)" prop="startPrice">
          <el-input maxlength="8" v-model="PriceRangeDialog.Form.startPrice" clearable placeholder="输入起始价" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
        <el-form-item label="定制价" prop="CustomizedPrice">
          <el-input maxlength="8" v-model="PriceRangeDialog.Form.CustomizedPrice" clearable placeholder="输入定制价" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="PriceRangeDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handlePriceRange('PriceRangeFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量改价 -->
    <el-dialog title="批量改价" :visible.sync="BatchChangePriceDialog.visible" width="450px" @closed="closeBatchChangePriceDialog">
      <el-form ref="BatchChangePriceRef" :model="BatchChangePriceDialog.Form" :rules="BatchChangePriceDialog.Rules" label-width="100px">
        <el-form-item label="调价比例" prop="ratio">
          <div class="flex_wrap">
            <el-input maxlength="8" v-model="BatchChangePriceDialog.Form.ratio" clearable placeholder="输入调价比例" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input><span>%</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="BatchChangePriceDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleBatchChangePrice('BatchChangePriceRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 同步价格 -->
    <el-dialog title="同步价格项" :visible.sync="SyncPriceDialog.visible" width="450px" @closed="closeSyncPriceDialog">
      <el-form ref="SyncPriceDialogRef" :model="SyncPriceDialog.Form" :rules="SyncPriceDialog.Rules" label-width="100px">
        <el-form-item label="定制产品" prop="product">
          <el-select v-model="SyncPriceDialog.Form.product" placeholder="选择定制产品" clearable filterable>
            <el-option v-for="item in MenuList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调价比例" prop="SyncPriceRatio">
          <div class="flex_wrap">
            <el-input maxlength="8" v-model="SyncPriceDialog.Form.SyncPriceRatio" clearable placeholder="输入调价比例" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input><span>%</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="SyncPriceDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSyncPrice('SyncPriceDialogRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PricingSystem",
  data() {
    return {
      submitLoading: false,
      MenuList: [{ id: 1, name: '制服四件套' }, { id: 2, name: '西服两件套' }, { id: 3, name: '西服三件套' }, { id: 4, name: '西服' }, { id: 5, name: '西裤' }, { id: 6, name: '马甲' }, { id: 7, name: '衬衫' }, { id: 8, name: '大衣' }, { id: 9, name: '风衣' }, { id: 10, name: '夹克' }, { id: 11, name: '针织纱' }],
      activeMenuName: "制服四件套", // 选中菜单
      tableLoading: false, // table 加载状态
      tableDataList: [],
      // 添加编辑价格区间
      PriceRangeDialog: {
        id: "",
        title: "",
        visible: false,
        Form: {
          startPrice: "",
          CustomizedPrice: "",
        },
        Rules: {
          startPrice: [
            { required: true, message: '请输入起始价', trigger: 'blur' },
          ],
          CustomizedPrice: [
            { required: true, message: '请输入定制价', trigger: 'blur' },
          ]
        },
      },
      // 批量改价
      BatchChangePriceDialog: {
        visible: false,
        Form: {
          ratio: "",
        },
        Rules: {
          ratio: [
            { required: true, message: '请输入调价比例', trigger: 'blur' },
          ],
        },
      },
      // 同步价格
      SyncPriceDialog: {
        visible: false,
        Form: {
          product: "",
          SyncPriceRatio: "",
        },
        Rules: {
          product: [
            { required: true, message: '请选择定制产品', trigger: 'change' }
          ],
          SyncPriceRatio: [
            { required: true, message: '请输入调价比例', trigger: 'blur' },
          ],
        },
      },
    }
  },
  created() {
    // 初始化数据
    this.initData()
  },
  methods: {
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
        if (this.activeMenuName == '制服四件套') {
          DataList = [
            { id: 1, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 2, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 3, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 4, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 5, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
          ]
        } else if (this.activeMenuName == '西服两件套') {
          DataList = [
            { id: 1, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 2, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
          ]
        } else if (this.activeMenuName == '西服三件套') {
          DataList = [
            { id: 1, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 2, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 3, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
          ]
        } else {
          DataList = [
            { id: 1, PriceRange: "¥ 0.01 ~ ¥ 55.00", CustomizedPrice: "834.40", LastUpdateTime: "2022-07-16 16:38:51" },
          ]
        }

        this.tableDataList = DataList;
        this.tableLoading = false;
      }, 500);
    },
    // 添加编辑价格区间弹框 打开(新增)
    handleAddPriceRangeDialog() {
      this.PriceRangeDialog.title = '新增价格项'
      this.PriceRangeDialog.visible = true
    },
    // 添加编辑价格区间弹框 打开(编辑)
    handleEditPriceRangeDialog(row) {
      this.PriceRangeDialog.title = '编辑价格项'
      this.PriceRangeDialog.id = row.id;
      this.PriceRangeDialog.Form.CustomizedPrice = row.CustomizedPrice
      this.PriceRangeDialog.visible = true;
    },
    // 添加编辑价格区间弹框 点击确定按钮
    handlePriceRange(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.PriceRangeDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 添加编辑价格区间弹框 关闭
    closePriceRangeDialog() {
      this.$refs['PriceRangeFormRef'].resetFields();
      this.PriceRangeDialog.Form = {
        startPrice: "",
        CustomizedPrice: "",
      }
    },

    // 批量改价 打开
    handleOpenBatchChangePrice() {
      this.BatchChangePriceDialog.visible = true;
    },
    // 批量改价 点击确定按钮
    handleBatchChangePrice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.BatchChangePriceDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 批量改价 关闭
    closeBatchChangePriceDialog() {
      this.$refs['BatchChangePriceRef'].resetFields();
      this.BatchChangePriceDialog.Form.ratio = ''
    },

    // 同步价格 打开
    handleOpenSyncPrice() {
      this.SyncPriceDialog.visible = true;
    },
    // 同步价格 点击确定按钮
    handleSyncPrice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.SyncPriceDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 同步价格 关闭
    closeSyncPriceDialog() {
      this.$refs['SyncPriceDialogRef'].resetFields();
      this.SyncPriceDialog.Form.product = ''
      this.SyncPriceDialog.Form.SyncPriceRatio = ''
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
    }
  }
}
</script>

<style lang="scss" scoped>
.topMenuBtn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex_wrap {
  display: flex;
  gap: 10px;
  .el-input {
    width: 200px;
  }
}
</style>