
<template>
  <div>
    <el-upload :disabled="disabled" :list-type="listType" :headers="headers" :action="imgUploadUrl" :multiple="multiple" accept="image/jpg,image/jpeg,image/png" :before-upload="beforeUpload" :file-list="fileList" :limit="maxLimit"
      :on-exceed="handleExceed" :on-preview="handlePictureCardPreview" :class="[{ hide: tempFileList.length >= maxLimit }]" :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-image-viewer v-if="dialogVisible" zIndex="9999" :on-close="closeImgViewer" :url-list="[dialogImageUrl]" />
  </div>
</template> 
<script>  
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: {
    ElImageViewer,
  },
  props: {
    // 文件列表的类型 text/picture/picture-card
    listType: {
      type: String,
      default: "picture-card",
    },
    // 设置上传的请求头部
    headers: {
      type: Object,
      default: () => {
        return { Authorization: '' };
      },
    },
    // 必选参数，上传的地址
    imgUploadUrl: {
      type: String,
      default: process.env.VUE_APP_UPLOAD_URL,
    },
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: false,
    },
    // 允许上传的最大张数
    maxLimit: {
      type: Number,
      default: 5,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 配合v-model 加载初始值
    value: [String, Object, Array],
  },
  data() {
    return {
      // 上传的图片集合
      fileList: [],

      // 因为 fileList为只读属性，所以用了一个中间变量来进行数据改变的交互。
      tempFileList: [],

      // 大图预览地址
      dialogImageUrl: "",

      // 大图预览弹框
      dialogVisible: false,
    };
  },
  watch: {
    // 监听图片值的改变
    value: {
      handler: function (newVal, oldVa) {
        this.fileList = newVal;
        this.tempFileList = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // 上传的图片集合
    this.fileList = JSON.parse(JSON.stringify(this.value));
  },
  methods: {
    // 上传错误提示
    handleError(err, file, fileList) {
      this.$message.error({
        message: "上传图片失败, 请刷新后再试",
        center: true, //文字是否居中
        offset: 360, //Message 距离窗口顶部的偏移量
        duration: 1500, //显示时间, 毫秒
      });
    },
    // 上传之前验证
    beforeUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
      const extension =
        testmsg === "jpg" || testmsg === "jpeg" || testmsg === "png";
      if (!extension) {
        this.$message.error('格式不支持,只允许上传 jpg、jpeg、png 格式');
      }
      return extension
    },
    // 超过个数钩子
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.maxLimit} 张图片，本次选择了 ${files.length} 张图片，共选择了 ${files.length + fileList.length} 张图片`);
    },

    // 删除图片
    handleRemove(file, fileList) {
      // this.fileList = fileList;
      this.changeFileList(fileList);
      this.$emit("delImg", file, fileList);
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      this.changeFileList(fileList);
    },

    // 关闭大图预览
    closeImgViewer() {
      this.dialogVisible = false;
    },

    // 大图预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 文件列表改变的时候，更新组件的v-model的文的数据
    changeFileList(fileList) {
      this.$emit("input", fileList);
    },
  },
};
</script>

<style scoped>
.hide >>> .el-upload--picture-card {
  display: none;
}
</style>
