
<template>
  <div>
    <el-upload class="avatar-uploader" :action="imgUploadUrl" accept="image/jpg,image/jpeg,image/png" :before-upload="beforeUpload" :show-file-list="false" :on-error="handleError"
      :on-success="(response, file, fileList)=>{return handleSuccess(response, file, fileList)}">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <!--页面新增删除和预览-->
      <span v-if="imageUrl" @click.stop="" class="el-upload-list__item-actions">
        <span class="upload-icon">
          <span class="el-uploads-span" style="margin-right: 10px;" @click.stop="bigImgViewer">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-span" @click.stop="oploadImgDel">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </span>
    </el-upload>
    <!-- 查看大图容器 -->
    <el-image-viewer v-if="dialogVisible" :zIndex="9999" :on-close="closeImgViewer" :url-list="[imageUrl]" />
  </div>
</template> 
<script>  
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: {
    ElImageViewer,
  },
  props: {
    // 必选参数，上传的地址
    imgUploadUrl: {
      type: String,
      default: process.env.VUE_APP_UPLOAD_URL,
    },
    // 配合v-model 加载初始值
    value: [String, Object, Array],
  },
  data() {
    return {
      imageUrl: '',
      dialogVisible: false,
    };
  },
  watch: {
    // 监听图片值的改变
    value: {
      handler: function (newVal, oldVa) {
        let picUrl = newVal ? newVal.trim() : newVal
        this.imageUrl = picUrl ? process.env.VUE_APP_BASE_API + picUrl : picUrl;
      },
      immediate: true,
      deep: true,
    },
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
    // 上传成功
    handleSuccess(response, file, fileList, item) {

      let path = file.response.successPath

      this.changeFileList(path);
      this.$emit("UploadSuccess", path);
    },

    // 文件列表改变的时候，更新组件的v-model的文的数据
    changeFileList(path) {
      this.$emit("input", path);
    },
    // 大图预览
    bigImgViewer() {
      this.dialogVisible = true;
    },
    // 删除
    oploadImgDel() {
      this.imageUrl = "";
      this.changeFileList('');
    },
    // 关闭大图预览
    closeImgViewer() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}

.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
}

.el-upload-list__item-actions:hover span {
  display: inline-block;
  cursor: pointer;
}
.el-upload-list__item-actions:hover {
  opacity: 1;
}

.upload-icon {
  position: absolute;
  top: 50%;
  margin-left: -28px;
  margin-top: -18px;
}
</style>
