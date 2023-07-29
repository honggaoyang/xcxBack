<template>
  <el-dialog title="订单备注" :visible.sync="isShowDialog"  width="600px" @closed="onClosedDialog">
    <el-form ref="formRef" :model="form" :inline="false" :rules="formRules" label-width="80px" style="margin-top:20px">
      <el-form-item label="内部备注" prop="InternalRemarks">
        <el-input maxlength="500" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="form.InternalRemarks" placeholder="输入内部备注"></el-input>
      </el-form-item>
      <el-form-item label="客户备注" prop="CustomerRemarks">
        <el-input maxlength="500" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="form.CustomerRemarks" placeholder="输入客户备注"></el-input>
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
      form: {
        InternalRemarks: '',
        CustomerRemarks: '',
      },
      formRules: {
        InternalRemarks: [
          { required: true, message: '请输入内部备注', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入内部备注', trigger: 'blur' }
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
    },
    // 关闭弹框
    onClosedDialog() {
      this.$refs['formRef'].resetFields() // 仅清除验证
      this.$emit('closed', {}) // 传出选择对象
      this.$emit('update:id', 0) // 重置ID
    },
    // 点击确定按钮
    handleSubmit(refName) {
      this.$refs[refName].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          setTimeout(() => {
            this.$message.success('备注成功')
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