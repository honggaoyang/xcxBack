<template>
  <el-dialog :title="dialogTitle" :visible.sync="isShowDialog" top="8vh" width="700px" @closed="onClosedDialog">
    <el-table v-loading="tableLoading" class="hhy-table" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
      <!-- 序号 -->
      <el-table-column type="index" label="序号" />
      <el-table-column label="布料" prop="cloth"></el-table-column>
      <el-table-column label="颜色" prop="color"></el-table-column>
      <el-table-column label="纹路" prop="lines"></el-table-column>
      <el-table-column label="长度">
        <template slot-scope="{row}">
          <el-tag>{{row.length}}米</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-form ref="formRef" :model="form" :inline="false" :disabled="dialogIsLook" :rules="formRules" label-width="80px" class="fabricLogistics_wrap">
      <el-form-item label="收货人">
        {{form.consignee}}
      </el-form-item>
      <el-form-item label="物流公司" prop="logisticsCompany">
        <el-select v-model="form.logisticsCompany" placeholder="选择物流公司" clearable filterable>
          <el-option v-for="item in logisticsCompanyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号" prop="trackingNumber">
        <el-input maxlength="30" v-model="form.trackingNumber" clearable placeholder="输入快递单号"></el-input>
      </el-form-item>
      <el-form-item label="发货时间" v-if="dialogIsLook">
        <el-link type="primary" href="https://www.baidu.com" target="_blank">点击查看物流</el-link>
      </el-form-item>
    </el-form>
    <span slot="footer" v-if="!dialogIsLook">
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
    id: { type: Number, default: 0 },
    dialogType: { type: String, default: 'edit' },
  },
  data() {
    return {
      isShowDialog: false, // 是否显示弹框 
      dialogTitle: '标题',  // 标题
      dialogIsLook: false, // 是否查看
      tableDataList: [],
      submitLoading: false,
      tableLoading: false,
      logisticsCompanyList: [{ id: 1, name: '京东物流' }, { id: 2, name: '德邦物流' }],
      form: {
        consignee: '',
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
    },
    // 监听类型，设置标题
    dialogType: function (val) {
      this.dialogTitle = val === 'add' ? '新增' : (val === 'edit' ? '布料发货' : (val === 'look' ? '查看布料物流' : this.dialogTitle))
      this.dialogIsLook = val === 'look'
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
        this.tableDataList = [
          { cloth: '066-920-74', color: '黑色', lines: '无', length: 0.02 },
        ]

        if (this.dialogType == 'edit') {
          this.form = {
            consignee: '张三丰',
            logisticsCompany: '',
            trackingNumber: '',
          }
        } else {
          this.form = {
            consignee: '张三丰',
            logisticsCompany: 1,
            trackingNumber: 10000001,
          }
        }



        this.tableLoading = false;
      }, 500);
    },
    // 关闭弹框
    onClosedDialog() {
      if (!this.dialogIsLook) {
        this.$refs['formRef'].resetFields() // 仅清除验证 
      }
      this.$refs['formRef'].resetFields() // 仅清除验证 
      this.form = {
        consignee: '',
        logisticsCompany: '',
        trackingNumber: '',
      }

      this.$emit('closed', {}) // 传出选择对象

      this.$emit('update:id', 0)
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
.fabricLogistics_wrap {
  margin-top: 20px;
  .el-input,
  .el-select {
    width: 210px;
  }
}
</style>