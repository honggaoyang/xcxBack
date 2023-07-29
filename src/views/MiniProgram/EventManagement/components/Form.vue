<template>
  <div class="hhy-container">
    <div class="hhy-card product_wrap">
      <el-form ref="EventFormRef" :model="EventForm" :inline="false" :rules="EventFormRules" label-width="100px">
        <!-- <div class="hhy-tips">
          <p>基本信息</p>
        </div> -->
        <el-form-item label="活动名称" prop="Name">
          <el-input maxlength="30" clearable placeholder="请输入活动名称" v-model="EventForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="活动封面" prop="coverImg">
          <myUpload v-model="EventForm.coverImg"></myUpload>
        </el-form-item>
        <el-form-item label="活动详情" prop="ContentDetail">
          <Tinymce v-model="EventForm.ContentDetail" :height="400" />
        </el-form-item>
        <el-form-item class="footerBtn">
          <el-button @click="resetForm('EventFormRef')">重置</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submitForm('EventFormRef')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import myUpload from "@/components/el-upload";  // 上传
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    myUpload,
    Tinymce
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      submitLoading: false, // 提交按钮 
      EventForm: {
        Name: '',
        coverImg: '',
        ContentDetail: '',
      },
      EventFormRules: {
        Name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入活动名称', trigger: 'blur' }
        ],
        // coverImg: [
        //   { required: true, message: '请上传活动封面', trigger: 'change' },
        // ],
        ContentDetail: [
          { required: true, message: '请输入活动详情', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入活动详情', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.$message.success(`当前ID为${id}`)
    }
  },
  methods: {
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.$message.success('操作成功!')
            this.submitLoading = false;

            // 调用全局挂载的方法，关闭当前页
            this.$store.dispatch("tagsView/delView", this.$route);
            // 关闭之后跳转你要跳转的路由
            this.$router.push({ path: '/MiniProgram/EventManagement' })
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.EventForm = {
        Name: '',
        coverImg: '',
        ContentDetail: '',
      }
    }
  }
}
</script>

<style scoped lang="scss">
.product_wrap {
  .el-input {
    width: 300px;
  }
  .footerBtn {
    text-align: right;
  }
}
</style>
 