<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格顶部操作 -->
      <template #tableMenuBtn>
        <div class="tableMenuBtn">
          <div class="hhy-tips">
            <p>{{Name}} - 工艺选项</p>
          </div>

          <el-button type="" @click="$router.go(-1)" icon="el-icon-back">返回</el-button>
          <el-button type="primary" @click="handleAddProcessOption" icon="el-icon-plus">添加</el-button>
        </div>
      </template>

      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+30" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="名称" prop="name" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{row}">
              <el-image :src="row.img" :preview-src-list="[row.img]" style="width:60px;height:60px"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="成本" prop="cost"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="限定工厂" min-width="150" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-tag v-if="row.restrictedFactory.name" closable @close="handleCloseTag(row)">{{row.restrictedFactory.name}}：￥{{row.restrictedFactory.price}}</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" width="400">
            <template slot-scope="{row}">
              <el-button icon="el-icon-edit" type="warning" @click="handleEditProcessOption(row)">编辑</el-button>
              <el-button icon="el-icon-setting" type="primary" @click="handleRestrictedFactory(row)">限定工厂</el-button>
              <el-button v-if="row.status=='已禁用'" icon="el-icon-turn-off" type="success" @click="handleEnable(row)">启用</el-button>
              <el-button v-if="row.status=='已启用'" icon="el-icon-open" type="danger" @click="handleDisable(row)">禁用</el-button>
              <el-button icon="el-icon-delete" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageWrap>

    <!-- 新增编辑工艺选项弹框  -->
    <el-dialog :title="editProcessDialog.title" top="8vh" :visible.sync="editProcessDialog.visible" width="550px" @closed="closeEditProcessDialog">
      <el-form ref="editProcessRef" class="editProcessDialog" :model="editProcessDialog.Form" :inline="false" :rules="editProcessDialog.Rules" label-width="80px">
        <el-form-item label="选项名称" prop="option">
          <el-input maxlength="30" v-model="editProcessDialog.Form.option" clearable placeholder="请输入选项名称"></el-input>
        </el-form-item>
        <el-form-item label="选项图片" prop="technologyName">
          <myUpload v-model="editProcessDialog.Form.optionImg"></myUpload>
        </el-form-item>
        <el-form-item label="制作工费" prop="costs">
          <el-input maxlength="8" v-model="editProcessDialog.Form.costs" clearable placeholder="请输入制作工费" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
        <el-form-item label="默认选项" prop="defaultOption">
          <el-checkbox v-model="editProcessDialog.Form.defaultOption"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editProcessDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitEditProcess('editProcessRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 限定工厂弹框 -->
    <el-dialog title="指定工艺供应商" top="8vh" :visible.sync="restrictedFactoryDialog.visible" width="550px" @closed="closeRestrictedFactoryDialog">
      <el-form ref="restrictedFactoryDialogRef" class="editProcessDialog" :model="restrictedFactoryDialog.Form" :inline="false" :rules="restrictedFactoryDialog.Rules" label-width="80px">
        <el-form-item label="工艺选项" prop="optionName">
          {{restrictedFactoryDialog.Form.optionName}}
        </el-form-item>
        <el-form-item label="工厂" prop="factoryID">
          <el-select v-model="restrictedFactoryDialog.Form.factoryID" placeholder="请选择工厂" filterable clearable>
            <el-option v-for="item in restrictedFactoryDialog.factoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="制作工费" prop="costs">
          <el-input maxlength="8" v-model="restrictedFactoryDialog.Form.costs" clearable placeholder="请输入制作工费" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="restrictedFactoryDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSubmitFactory('restrictedFactoryDialogRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myUpload from "@/components/el-upload";  // 上传
export default {
  name: "",
  components: {
    myUpload
  },
  data() {
    return {
      ID: "",
      Name: "",
      submitLoading: false,
      tableLoading: false,
      tableDataList: [],
      // 新增编辑工艺弹框
      editProcessDialog: {
        title: "",
        visible: false,
        Form: {
          option: '',
          optionImg: "",
          costs: "",
          defaultOption: false,
        },
        Rules: {
          option: [
            { required: true, message: '请输入选项名称', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入选项名称', trigger: 'blur' }
          ],
        },
      },
      // 限定工厂弹框
      restrictedFactoryDialog: {
        visible: false,
        factoryList: [{ id: 1, name: '北京厂' }],
        Form: {
          optionName: "",
          factoryID: "",
          costs: "",
        },
        Rules: {
          factoryID: [
            { required: true, message: '请选择工厂', trigger: 'change' }
          ],
        }
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "已启用": 'success',
        "已禁用": 'info',
      }
      return statusMap[status]
    }
  },
  created() {
    this.ID = this.$route.query && this.$route.query.id
    this.Name = this.$route.query && this.$route.query.name
    this.$message.success(`当前ID为${this.ID}`)

    // 初始化数据
    this.initData()
  },
  methods: {
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          { id: 1, name: 'F-01:八字领', img: 'https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg', cost: '-', status: '已启用', restrictedFactory: {}, createTime: '2023-11-12 12:12:12' },
          { id: 2, name: 'F-02:一字领', img: 'https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg', cost: '-', status: '已禁用', restrictedFactory: { name: '北京厂', price: 800.00 }, createTime: '2023-11-12 12:12:12' },
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 关闭限定工厂标签
    handleCloseTag(row) {
      this.$confirm('确认删除限定工厂吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.restrictedFactory = {}
        this.$message.success('删除成功');
        this.initData();
      }).catch(() => { });
    },
    // 添加工艺选项
    handleAddProcessOption() {
      this.editProcessDialog.title = "新增工艺选项"
      this.editProcessDialog.visible = true;
    },
    // 编辑工艺选项
    handleEditProcessOption(row) {
      this.editProcessDialog.title = "编辑工艺选项"
      this.editProcessDialog.Form.option = row.name;
      this.editProcessDialog.visible = true;
    },

    // 编辑工艺弹框点击确定
    handleSubmitEditProcess(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.editProcessDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 关闭编辑工艺弹框
    closeEditProcessDialog() {
      this.$refs['editProcessRef'].resetFields();
      this.editProcessDialog.title = "";

      this.editProcessDialog.Form.option = "";
      this.editProcessDialog.Form.optionImg = "";
      this.editProcessDialog.Form.costs = "";
      this.editProcessDialog.Form.defaultOption = false;
    },

    // 打开限定工厂弹框
    handleRestrictedFactory(row) {
      this.restrictedFactoryDialog.visible = true;
      this.restrictedFactoryDialog.Form.optionName = row.name;
    },
    // 限定工厂弹框点击确定
    handleSubmitFactory(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.restrictedFactoryDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 关闭限定工厂弹框
    closeRestrictedFactoryDialog() {
      this.$refs['restrictedFactoryDialogRef'].resetFields();
      this.restrictedFactoryDialog.Form.optionName = '';
      this.restrictedFactoryDialog.Form.factoryID = '';
      this.restrictedFactoryDialog.Form.costs = '';
    },

    // 启用
    handleEnable(row) {
      // row.status = "已启用"
      this.$message.success('操作成功')
      this.initData();
    },
    // 禁用
    handleDisable(row) {
      this.$confirm('禁用后，该工艺选项将不可使用，确认吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.status = "已禁用"
        this.$message.success('操作成功')
        this.initData();
      }).catch(() => { });
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
        this.initData();
      }).catch(() => { });
    },
  }
}
</script>

<style lang="scss" scoped>
.editProcessDialog {
  .el-input,
  .el-select {
    width: 210px;
  }
}
</style>