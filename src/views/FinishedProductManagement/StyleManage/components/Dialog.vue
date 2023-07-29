<template>
  <el-dialog :title="dialogTitle" :visible.sync="isShowDialog" top="8vh" width="78%" @closed="onClosedDialog">
    <div style="height:400px;overflow:auto;">
      <el-form ref="dialogFormRef" :model="dialogForm" :inline="true" :rules="dialogFormRules" label-width="120px" :disabled="dialogIsLook">
        <div class="hhy-tips">
          <p>款式信息</p>
        </div>
        <el-form-item label="服装品类" prop="product">
          <el-select v-model="dialogForm.product" placeholder="请选择服装品类" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="款式编号" prop="styleNumber">
          <el-input maxlength="30" clearable placeholder="款式编号" v-model="dialogForm.styleNumber"></el-input>
        </el-form-item>
        <el-form-item label="款式名称" prop="styleName">
          <el-input maxlength="10" clearable placeholder="款式名称" v-model="dialogForm.styleName"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl">
          <myUpload v-model="dialogForm.imgUrl"></myUpload>
        </el-form-item>
        <div class="hhy-tips">
          <p>工艺信息</p>
        </div>
        <el-form-item label="制作工艺" prop="technology">
          <el-select v-model="dialogForm.technology" placeholder="请选择制作工艺" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领宽" prop="neckWidth">
          <el-select v-model="dialogForm.neckWidth" placeholder="请选择领宽" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领型" prop="Collar">
          <el-select v-model="dialogForm.Collar" placeholder="请选择领型" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领型备注" prop="CollarRemarks">
          <el-input clearable placeholder="请输入领型备注" v-model="dialogForm.CollarRemarks"></el-input>
        </el-form-item>
        <el-form-item label="门襟" prop="Placket">
          <el-select v-model="dialogForm.Placket" placeholder="请选择门襟" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挂面" prop="Hangmian">
          <el-select v-model="dialogForm.Hangmian" placeholder="请选择挂面" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开衩" prop="makeSlitVent">
          <el-select v-model="dialogForm.makeSlitVent" placeholder="请选择开衩" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下摆" prop="Hem">
          <el-select v-model="dialogForm.Hem" placeholder="请选择下摆" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="肩型" prop="ShoulderType">
          <el-select v-model="dialogForm.ShoulderType" placeholder="请选择肩型" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="里布工艺" prop="LiningProcess">
          <el-select v-model="dialogForm.LiningProcess" placeholder="里布工艺" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="胸口袋" prop="ChestPocket">
          <el-select v-model="dialogForm.ChestPocket" placeholder="请选择胸口袋" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下口袋" prop="LowerPocket">
          <el-select v-model="dialogForm.LowerPocket" placeholder="请选择下口袋" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绣字位置" prop="EmbroideryPosition">
          <el-select v-model="dialogForm.EmbroideryPosition" placeholder="请选择绣字位置" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绣字内容" prop="EmbroideryContent">
          <el-input clearable placeholder="请输入绣字内容" v-model="dialogForm.EmbroideryContent"></el-input>
        </el-form-item>
        <el-form-item label="绣字线色" prop="EmbroideredColor">
          <el-select v-model="dialogForm.EmbroideredColor" placeholder="请选择绣字线色" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="花眼" prop="VariegatedEye">
          <el-select v-model="dialogForm.VariegatedEye" placeholder="请选择花眼" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="花眼线色" prop="ColoredEyeliner">
          <el-select v-model="dialogForm.ColoredEyeliner" placeholder="请选择花眼线色" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="里料颜色" prop="LiningColor">
          <el-select v-model="dialogForm.LiningColor" placeholder="请选择里料颜色" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纽扣" prop="Button">
          <el-select v-model="dialogForm.Button" placeholder="请选择纽扣" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="高级工艺" prop="AdvancedCraftsmanship">
          <el-select v-model="dialogForm.AdvancedCraftsmanship" placeholder="请选择高级工艺" filterable clearable>
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="贡针" prop="TributeNeedle">
          <el-select v-model="dialogForm.TributeNeedle" placeholder="请选择贡针" filterable clearable>
            <el-option v-for="item in  productList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尺码S码" prop="SizeS">
          <el-input clearable placeholder="请输入尺码" v-model="dialogForm.SizeS"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span v-if="!dialogIsLook" slot="footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button :loading="submitLoading" type="primary" @click="onDialogSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import myUpload from "@/components/el-upload";  // 上传
export default {
  components: {
    myUpload
  },
  props: {
    // 是否显示
    isShow: { type: Boolean, default: false },
    // add，edit，look
    dialogType: { type: String, default: 'add' },
  },
  data() {
    return {
      isShowDialog: false, // 是否显示弹框
      dialogTitle: '标题',  // 标题
      dialogIsLook: false, // 是否查看
      submitLoading: false,
      productList: [
        { id: 1, name: '上衣' },
        { id: 2, name: '西裤' },
        { id: 3, name: '马甲' }
      ],
      dialogForm: {
        product: "", // 服装品类
        styleNumber: "", // 款式编号
        styleName: "", // 款式名
        imgUrl: "", // 图片
        technology: "", // 制作工艺
        neckWidth: "", // 领宽
        Collar: "", // 领型
        CollarRemarks: "", // 领型备注
        Placket: "", // 门襟
        Hangmian: "", // 挂面
        makeSlitVent: "", // 开衩
        Hem: "", // 下摆
        ShoulderType: "", // 肩型
        LiningProcess: "", // 里布工艺
        ChestPocket: "", // 胸口袋	
        LowerPocket: "", // 下口袋	
        EmbroideryPosition: "", // 绣字位置
        EmbroideryContent: "", // 绣字内容
        EmbroideredColor: "", // 绣字线色
        VariegatedEye: "", // 花眼
        ColoredEyeliner: "", // 花眼线色	
        LiningColor: "", // 里料颜色
        Button: "", // 纽扣
        AdvancedCraftsmanship: "", // 高级工艺
        TributeNeedle: "", // 贡针 
        SizeS: "", // 尺码S码
      },
      dialogFormRules: {
        product: [
          { required: true, message: '请选择服装品类', trigger: 'change' }
        ],
        styleNumber: [
          { required: true, message: '请输入款式编号', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入款式编号', trigger: 'blur' }
        ],
        styleName: [
          { required: true, message: '请输入款式名称', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入款式名称', trigger: 'blur' }
        ],
        // imgUrl: [
        //   { required: true, message: '请上传图片', trigger: 'change' },
        // ]
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
    // 监听类型，设置标题
    dialogType: function (val) {
      this.dialogTitle = val === 'add' ? '新增' : (val === 'edit' ? '编辑' : (val === 'look' ? '查看' : this.dialogTitle))
      this.dialogIsLook = val === 'look'
    }
  },
  methods: {
    // 修改父组件弹框show的值  dialogOption.isShowDialog
    showDialog(isShow) {
      this.$emit('update:isShow', isShow) // isShowDialog改变时同步父组件show的值
    },
    // 保存按钮事件
    onDialogSubmit() {
      this.$refs['dialogFormRef'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          setTimeout(() => {
            this.$message.success(this.dialogTitle == '新增' ? '添加成功' : '修改成功')
            this.submitLoading = false
            this.isShowDialog = false // 关闭弹框
            this.$emit('success', {}) // 传出选择对象
          }, 500);
        }
      })
    },
    // 关闭弹框
    onClosedDialog() {
      if (!this.dialogIsLook) {
        this.$refs['dialogFormRef'].resetFields() // 仅清除验证
      }
      this.$emit('closed', {}) // 传出选择对象
    },
  }
}
</script>

<style>
</style>