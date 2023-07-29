<template>
  <el-dialog title="下制衣单" :visible.sync="isShowDialog" top="8vh" width="650px" @closed="onClosedDialog">
    <el-form ref="formRef" :model="form" :inline="false" :rules="formRules" label-width="80px" class="LowerGarmentList_wrap">
      <el-form-item label="原料商" prop="RawMaterialSupplier">
        {{form.RawMaterialSupplier}}
      </el-form-item>
      <el-form-item label="面料品牌" prop="FabricBrand">
        {{form.FabricBrand}}
      </el-form-item>
      <el-form-item label="面料号" prop="FabricNumber">
        {{form.FabricNumber}}
      </el-form-item>
      <el-form-item label="面料门幅" prop="FabricDoorWidth">
        {{form.FabricDoorWidth}} cm
      </el-form-item>
      <el-form-item label="用料" prop="Mater">
        <el-input maxlength="8" v-model="form.Mater" clearable placeholder="米数(单位：米)" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
      </el-form-item>
      <el-form-item label="工厂" prop="Factory">
        <el-select v-model="form.Factory" placeholder="选择工厂" clearable filterable>
          <el-option v-for="item in FactoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收货信息" prop="ReceivInfo">
        {{form.ReceivInfo}}
      </el-form-item>

    </el-form>
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
      submitLoading: false,
      FactoryList: [{ id: 1, name: '北京工厂' }],
      form: {
        RawMaterialSupplier: "", // 原料商
        FabricBrand: "", // 面料品牌
        FabricNumber: "", // 面料号
        FabricDoorWidth: "", // 门幅
        Mater: "", // 米数
        Factory: "", // 工厂
        ReceivInfo: "", // 收货信息
      },
      formRules: {
        Factory: [
          { required: true, message: '请选择工厂', trigger: 'change' }
        ],
        Mater: [
          { required: true, message: '请输入用料米数', trigger: 'blur' },
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
      this.form = {
        RawMaterialSupplier: "耐克", // 原料商
        FabricBrand: "耐克经典款", // 面料品牌
        FabricNumber: "ssi-001", // 面料号
        FabricDoorWidth: 10, // 门幅
        Mater: "", // 米数
        Factory: "", // 工厂
        ReceivInfo: "暂无", // 收货信息
      }

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
            this.$message.success('下制衣单成功')
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
.LowerGarmentList_wrap {
  margin-top: 20px;
  .el-input,
  .el-select {
    width: 210px;
  }
}
</style>