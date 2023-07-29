<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <el-button type="primary" @click="addPoster" icon="el-icon-plus">添加广告</el-button>
        </div>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+15" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="名称" show-overflow-tooltip prop="Name" />
          <el-table-column label="图片">
            <template slot-scope="{row}">
              <el-image style="width: 50px; height: 50px" :src="row.Img" :preview-src-list="[row.Img]"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="跳转链接" show-overflow-tooltip prop="Link" />
          <el-table-column label="是否启用">
            <template slot-scope="{row}">
              <el-tag :type="row.Status | statusFilter">{{row.Status}}</el-tag>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="300">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="primary" @click="handleEditPoster(row)">编辑</el-button>
              <el-button icon="el-icon-remove" type="danger" @click="handleDisabled(row)" v-if="row.Status=='已启用'">停用</el-button>
              <el-button icon="el-icon-circle-plus" type="success" @click="handleEnable(row)" v-else>启用</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row,false)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>

    <!-- 新增编辑广告弹框 -->
    <el-dialog :title="PosterDialog.title" :visible.sync="PosterDialog.visible" width="550px" @closed="closePosterDialog">
      <el-form :model="PosterDialog.Form" :rules="PosterDialog.Rules" ref="PosterDialogRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input maxlength="50" clearable placeholder="输入标题" v-model="PosterDialog.Form.title"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="imgUrl">
          <myUpload v-model="PosterDialog.Form.imgUrl"></myUpload>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input maxlength="100" clearable placeholder="输入链接" v-model="PosterDialog.Form.link"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="PosterDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitPoster('PosterDialogRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myUpload from "@/components/el-upload";  // 上传
export default {
  name: 'AdvertisementManagement',
  components: {
    myUpload
  },
  data() {
    return {
      tableLoading: false, // table 加载状态
      tableDataList: [], // 表格数据
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },
      submitLoading: false, // 提交加载状态

      // 新增编辑广告弹框
      PosterDialog: {
        title: '',
        visible: false,
        Form: {
          title: '',
          imgUrl: '',
          link: '',
        },
        Rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入标题', trigger: 'blur' }
          ],
          // imgUrl: [
          //   { required: true, message: '请上传图片', trigger: 'change' },
          // ],
          link: [
            { required: true, message: '请输入链接', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入链接', trigger: 'blur' }
          ],
        },
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "已启用": 'success',
        "已停用": 'danger',
      }
      return statusMap[status]
    }
  },
  created() {
    // 初始化数据
    this.initData()
  },
  methods: {
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { id: 1, Name: "一“明”惊人", Img: 'https://www.mx-mtm.com/API_Upload/Images/Factory/FabricStock/20221130142537_1591.jpg', Link: "http://www.baidu.com", Status: "已启用" },
          { id: 2, Name: "“咳”不容缓", Img: 'https://www.mx-mtm.com/API_Upload/Images/Factory/FabricStock/20221130142537_1591.jpg', Link: "http://www.baidu.com", Status: "已启用" },
          { id: 3, Name: "“骑”乐无穷", Img: 'https://www.mx-mtm.com/API_Upload/Images/Factory/FabricStock/20221130142537_1591.jpg', Link: "http://www.baidu.com", Status: "已停用" },
          { id: 4, Name: "“鳖”来无恙", Img: 'https://www.mx-mtm.com/API_Upload/Images/Factory/FabricStock/20221130142537_1591.jpg', Link: "http://www.baidu.com", Status: "已启用" },
          { id: 5, Name: "默默无“蚊”", Img: 'https://www.mx-mtm.com/API_Upload/Images/Factory/FabricStock/20221130142537_1591.jpg', Link: "http://www.baidu.com", Status: "已停用" },
        ]
        this.tableLoading = false;
      }, 500);
    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },

    // 新增编辑广告弹框 打开(新增)
    addPoster() {
      this.PosterDialog.title = '添加广告'
      this.PosterDialog.visible = true;
    },

    // 新增编辑广告弹框 打开(编辑)
    handleEditPoster(row) {
      this.PosterDialog.title = '编辑广告'
      this.PosterDialog.visible = true;

      this.PosterDialog.Form = {
        title: row.Name,
        imgUrl: row.Img,
        link: row.Link,
      }
    },
    // 新增编辑广告弹框 点击确定按钮
    submitPoster(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.submitLoading = false;
            this.PosterDialog.visible = false;
            this.$message.success('操作成功')
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 新增编辑广告弹框 关闭
    closePosterDialog() {
      this.$refs.PosterDialogRef.resetFields();

      this.PosterDialog.Form = {
        title: '',
        imgUrl: '',
        link: '',
      }
    },

    // 禁用
    handleDisabled(row) {
      this.$confirm('确定要停用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('操作成功');
        this.initData();
      }).catch(() => { });
    },
    // 启用
    handleEnable(row) {
      this.$message.success('操作成功');
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功');
        this.initData();
      }).catch(() => { });
    },
  }
}
</script>

<style lang="scss" scoped>
</style>