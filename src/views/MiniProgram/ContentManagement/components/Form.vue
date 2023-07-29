<template>
  <div class="hhy-container">
    <div class="hhy-card product_wrap">
      <el-form ref="ArtFormRef" :model="ArtForm" :inline="false" :rules="ArtFormRules" label-width="100px">
        <el-form-item label="内容主题">
          {{ContentTheme}}
        </el-form-item>
        <el-form-item label="文章标题" prop="Title">
          <el-input maxlength="30" clearable placeholder="输入文章标题" v-model="ArtForm.Title"></el-input>
        </el-form-item>
        <el-form-item label="文章封面" prop="coverImg">
          <myUpload v-model="ArtForm.coverImg"></myUpload>
        </el-form-item>
        <el-form-item label="文章摘要" prop="Abstract">
          <el-input maxlength="30" clearable placeholder="输入文章摘要" v-model="ArtForm.Abstract"></el-input>
        </el-form-item>
        <el-form-item label="文章详情" prop="ContentDetail">
          <Tinymce v-model="ArtForm.ContentDetail" :height="400" />
        </el-form-item>
        <el-form-item class="footerBtn">
          <el-button @click="resetForm('ArtFormRef')">重置</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submitForm('ArtFormRef')">提交</el-button>
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
      ID: '', // 文章ID
      ContentTheme: "", // 内容主题
      ContentThemeID: "", // 内容主题ID
      submitLoading: false, // 提交按钮 

      ArtForm: {
        Title: '',
        coverImg: '',
        Abstract: '',
        ContentDetail: '',
      },
      ArtFormRules: {
        Title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入文章标题', trigger: 'blur' }
        ],
        // coverImg: [
        //   { required: true, message: '请上传活动封面', trigger: 'change' },
        // ],

      },
    }
  },
  created() {
    const ContentTheme = this.$route.params && this.$route.params.name
    const ContentThemeID = this.$route.params && this.$route.params.ArtID
    this.ContentTheme = ContentTheme;
    this.ContentThemeID = ContentThemeID;

    if (this.isEdit) {
      const ID = this.$route.params && this.$route.params.id
      this.ID = ID;
      this.$message.success(`当前ID为${ID}`)
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
            // 关闭之后跳转你要跳转的路由(跳转到文章列表页面)
            this.$router.push({ name: 'Article', params: { id: this.ContentThemeID, name: this.ContentTheme } })
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
 