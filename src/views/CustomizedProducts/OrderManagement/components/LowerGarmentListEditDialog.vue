<template>
  <el-dialog title="编辑制衣数据" :visible.sync="isShowDialog" top="8vh" width="650px" @closed="onClosedDialog">
    <el-form ref="formRef" :model="form" :inline="false" :rules="formRules" label-width="100px" class="LowerGarmentList_wrap">
      <el-form-item label="面料成分" prop="FabricComposition">
        <el-input maxlength="8" v-model="form.FabricComposition" clearable placeholder="输入面料成分" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
      </el-form-item>
      <el-form-item label="面料门幅" prop="FabricDoorWidth">
        <el-input maxlength="8" v-model="form.FabricDoorWidth" clearable placeholder="输入面料门幅" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
      </el-form-item>
      <el-form-item label="面料分类" prop="FabricGroup">
        <el-checkbox-group v-model="form.FabricGroup">
          <el-checkbox v-for="item in FabricGroupList" :key="item.id" :label="item.name"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="成本价" prop="CostPrice">
        <el-input maxlength="8" v-model="form.CostPrice" clearable placeholder="输入成本价 (单位：元/米)" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
      </el-form-item>
      <el-form-item label="计价基础价" prop="BasisPrice">
        <el-input maxlength="8" v-model="form.BasisPrice" clearable placeholder="输入计价基础价(单位：元)" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
      </el-form-item>
      <el-form-item label="定制价格" prop="CustomPrice">
        <el-table class="hhy-table" :data="form.CustomPrice" stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" />
          <el-table-column label="服装" show-overflow-tooltip prop="name" />
          <el-table-column label="定制价" show-overflow-tooltip>
            <template slot-scope="{row}">
              ￥ {{row.price}}
            </template>
          </el-table-column>
        </el-table>
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
      // 面料分类列表
      FabricGroupList: [
        { id: 1, name: '上衣' },
        { id: 2, name: '西裤' },
        { id: 3, name: '马甲' },
        { id: 4, name: '衬衫' },
        { id: 5, name: '大衣' }
      ],
      form: {
        FabricComposition: '', // 面料成分
        FabricDoorWidth: '', // 面料门幅
        FabricGroup: [], // 面料分类
        CostPrice: '',  // 成本价
        BasisPrice: '', // 计价基础价
        CustomPrice: [],
      },
      formRules: {
        FabricComposition: [
          { required: true, message: '请输入面料成分', trigger: 'blur' }
        ],
        FabricDoorWidth: [
          { required: true, message: '请输入面料门幅', trigger: 'blur' },
        ],
        FabricGroup: [
          { type: 'array', required: true, message: '请选面料分类', trigger: 'change' }
        ],
        CostPrice: [
          { required: true, message: '请输入成本价', trigger: 'blur' },
        ],
        BasisPrice: [
          { required: true, message: '请输入计价基础价', trigger: 'blur' },
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
      this.form.CustomPrice = [
        { name: '两件套', price: 300.23 },
        { name: '西服', price: 131.23 },
        { name: '马甲', price: 288.00 },
      ]

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
            this.$message.success('编辑制衣数据成功')
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