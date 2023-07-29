<template>
  <el-dialog title="订单发货" :visible.sync="isShowDialog" top="8vh" width="700px" @closed="onClosedDialog">
    <div v-loading="tableLoading" element-loading-text="加载中..." class="dialog_wrap">
      <el-table class="hhy-table" :data="tableDataList" stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
        <!-- 序号 -->
        <el-table-column type="index" label="序号" />
        <el-table-column label="商品" prop="cloth">
          <template slot-scope="{row}">
            <div class="shopName_wrap">
              <div>
                <el-image :src="row.img" :preview-src-list="[row.img]"> </el-image>
              </div>
              <div>
                <span>{{row.name}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="number"></el-table-column>
      </el-table>

      <el-form ref="formRef" :model="form" :inline="false" :rules="formRules" label-width="80px" style="margin-top:20px">
        <el-form-item label="收货人" prop="consignee">
          {{form.consignee}}
        </el-form-item>
        <el-form-item label="收货地址" prop="consigneeAddress">
          {{form.consigneeAddress}}
        </el-form-item>
        <el-form-item label="物流公司" prop="logisticsCompany">
          <el-select v-model="form.logisticsCompany" placeholder="选择物流公司" clearable filterable>
            <el-option v-for="item in logisticsCompanyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="trackingNumber">
          <el-input maxlength="30" v-model="form.trackingNumber" clearable placeholder="输入快递单号"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button :loading="submitLoading" type="primary" @click="handleSubmit('formRef')">确 定</el-button>
    </span>

  </el-dialog>
</template>

<script> 
export default {
  props: {
    // 是否显示
    isShow: { type: Boolean, default: false },
    id: { type: Number, default: 0 }
  },
  data() {
    return {
      isShowDialog: false, // 是否显示弹框 
      tableDataList: [],
      tableLoading: false,
      submitLoading: false,
      logisticsCompanyList: [{ id: 1, name: '京东物流' }],
      form: {
        consignee: "",
        consigneeAddress: "",
        logisticsCompany: '',
        trackingNumber: '',
      },
      formRules: {
        logisticsCompany: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ],
        trackingNumber: [
          { required: true, message: '请输入快递单号', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入快递单号', trigger: 'blur' }
        ],
      }

    }
  },
  watch: {
    // 监听父组件传过来的值 是否显示弹框
    isShow: function (val) {
      this.isShowDialog = val;
    },
    // 监听当前页面弹框是否显示
    isShowDialog: function (val) {
      this.showDialog(val)
    },
    id(val) {
      this.getData(val)
    }
  },
  methods: {
    // 修改父组件弹框show的值  dialogOption.isShowDialog
    showDialog(isShow) {
      this.$emit('update:isShow', isShow) // isShowDialog改变时同步父组件show的值
    },

    // 获取数据
    getData(id) {
      if (id == 0) {
        return;
      }
      this.tableLoading = true;
      setTimeout(() => {
        this.form.consignee = '张三丰'
        this.form.consigneeAddress = '北京市海淀区'

        this.tableDataList = [
          { img: 'http://resource.vxiaocheng.com/dust/assets/img/suit_logo.png', name: '西服', number: '1' },
          { img: 'http://resource.vxiaocheng.com/dust/assets/img/suit_logo.png', name: '西服', number: '1' },
        ]
        this.tableLoading = false;
      }, 500);
    },
    // 关闭弹框
    onClosedDialog() {
      this.$refs['formRef'].resetFields() // 仅清除验证
      this.$emit('closed', {}) // 传出选择对象

      this.tableDataList = []
      this.$emit('update:id', 0) // 重置ID
    },
    // 点击确定按钮
    handleSubmit(refName) {
      this.$refs[refName].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          setTimeout(() => {
            this.$message.success('发货成功')
            this.submitLoading = false
            this.isShowDialog = false // 关闭弹框
            this.$emit('success', {}) // 传出选择对象
          }, 500);
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.dialog_wrap {
  height: 430px;
  overflow: auto;
  .el-input,
  .el-select {
    width: 210px;
  }
}
.shopName_wrap {
  display: flex;
  gap: 10px;
  .el-image {
    width: 50px;
    height: 50px;
  }
}
</style>