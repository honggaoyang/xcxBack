<template>
  <div>
    <el-tabs v-model="activeMenuName" @tab-click="handleMenuClick">
      <el-tab-pane v-for="item in MenuList" :key="item.id" :label="item.name" :name="item.name"></el-tab-pane>
    </el-tabs>

    <el-table v-loading="tableLoading" class="hhy-table" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
      <!-- 序号 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column label="起始价格(不包含)" min-width="130">
        <template slot-scope="{row}">
          超过 ¥ {{row.StartPrice}}
        </template>
      </el-table-column>
      <el-table-column label="品牌定制价" min-width="130">
        <template slot-scope="{row}">
          ¥ {{row.BrandPrice}}
        </template>
      </el-table-column>
      <el-table-column label="门店定制价" min-width="130">
        <template slot-scope="{row}">
          ¥ {{row.StorePrice}}
        </template>
      </el-table-column>
      <el-table-column label="最后更新" prop="LastUpdateTime" min-width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="{row}">
          <el-button icon="el-icon-edit" type="primary" @click="handleEditSettingPrice(row)">编辑</el-button>
          <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑价格项  -->
    <el-dialog title="编辑价格项" :visible.sync="SettingPriceDialog.visible" width="450px" @closed="closeSettingPriceDialog">
      <el-form ref="SettingPriceDialogRef" :model="SettingPriceDialog.Form" :rules="SettingPriceDialog.Rules" label-width="120px">
        <el-form-item label="起始价(超过)" prop="startPrice">
          <el-input maxlength="8" v-model="SettingPriceDialog.Form.startPrice" :disabled="true" clearable placeholder="请输入起始价" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
        <el-form-item label="品牌定制价" prop="brandPrice">
          <el-input maxlength="8" v-model="SettingPriceDialog.Form.brandPrice" :disabled="true" clearable placeholder="请输入品牌定制价" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
        <el-form-item label="门店定制价" prop="storePrice">
          <el-input maxlength="8" v-model="SettingPriceDialog.Form.storePrice" clearable placeholder="请输入门店定制价" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
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
      MenuList: [{ id: 1, name: '制服四件套' }, { id: 2, name: '西服两件套' }, { id: 3, name: '西服三件套' }, { id: 4, name: '西服' }, { id: 5, name: '西裤' }, { id: 6, name: '马甲' }, { id: 7, name: '衬衫' }, { id: 8, name: '大衣' }, { id: 9, name: '风衣' }, { id: 10, name: '夹克' }, { id: 11, name: '针织纱' }],
      submitLoading: false,
      activeMenuName: "制服四件套",
      tableLoading: false, // table 加载状态
      tableDataList: [],
      // 编辑价格项
      SettingPriceDialog: {
        id: "",
        visible: false,
        Form: {
          startPrice: "",
          brandPrice: "",
          storePrice: "",
        },
        Rules: {
          startPrice: [
            { required: true, message: '请输入起始价', trigger: 'blur' },
          ],
          storePrice: [
            { required: true, message: '请输入门店定制价', trigger: 'blur' },
          ]
        },
      }
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
            { id: 1, StartPrice: "55.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 2, StartPrice: "95.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 3, StartPrice: "120.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 4, StartPrice: "140.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 5, StartPrice: "150.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
          ]
        } else if (this.activeMenuName == '西服两件套') {
          DataList = [
            { id: 1, StartPrice: "55.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 2, StartPrice: "95.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
          ]
        } else if (this.activeMenuName == '西服三件套') {
          DataList = [
            { id: 1, StartPrice: "55.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
            { id: 2, StartPrice: "95.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
          ]
        } else {
          DataList = [
            { id: 1, StartPrice: "55.00", BrandPrice: "834.40", StorePrice: '1214.40', LastUpdateTime: "2022-07-16 16:38:51" },
          ]
        }

        this.tableDataList = DataList;
        this.tableLoading = false;
      }, 500);
    },

    // 编辑价格项 打开(编辑) 
    handleEditSettingPrice(row) {
      this.SettingPriceDialog.Form = {
        startPrice: row.StartPrice,
        brandPrice: row.BrandPrice,
        storePrice: row.StorePrice,
      }
      this.SettingPriceDialog.visible = true;
    },
    // 编辑价格项 点击确定按钮
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
    // 编辑价格项 关闭 
    closeSettingPriceDialog() {
      this.$refs['SettingPriceDialogRef'].resetFields();
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

<style>
</style>