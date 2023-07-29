<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" class="hhy-table" :height="slotProps.contentHeight+30" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->

          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="产品" min-width="65">
            <template slot-scope="{row}">
              <el-image :src="row.productImg" :preview-src-list="[row.productImg]" style="width:60px;height:60px"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="productName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" min-width="80">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="成衣" min-width="100">
            <template slot-scope="{row}">
              <el-tag effect="dark" :type="row.readyToWear | readyToWearFilter">{{row.readyToWear}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="候选工厂" min-width="300" show-overflow-tooltip>
            <template slot-scope="{row}">
              <div class="candidateFactories_wrap">
                <p v-for="(item,index) in row.candidateFactories" :key="index">
                  <el-tag closable @close="handleCloseTag(index, row)">{{item.name}}</el-tag>
                  <el-popover popper-class="CandidateFactories_popper" placement="top" trigger="hover">
                    <div class="content">
                      <span class="tit">选用版式</span>
                      <div v-if="item.format.length>0">
                        <el-tag class="selFormat" v-for="selItem,index in item.format" :key="index">{{selItem.name}}</el-tag>
                      </div>
                      <div v-else>你还没有选用版型</div>
                    </div>
                    <el-link v-if="item.format.length>0" @click="openSelectFactoryVersion(row)" slot="reference" type="primary" icon="el-icon-s-operation">管理版式</el-link>
                    <el-link v-else @click="openSelectFactoryVersion(row)" slot="reference" type="primary" icon="el-icon-plus">添加版式</el-link>
                  </el-popover>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="420">
            <template slot-scope="{row}">
              <el-button icon="el-icon-s-operation" type="primary" @click="handleSelFactory(row)">分配工厂</el-button>
              <el-button icon="el-icon-edit" type="warning" @click="handleProcess(row)">工艺参数</el-button>
              <el-button icon="el-icon-reading" type="success" @click="handleVolume(row)">量体参数</el-button>
              <el-button v-if="row.status=='已禁用'" icon="el-icon-turn-off" type="info" @click="handleEnable(row)">启用</el-button>
              <el-button v-if="row.status=='已启用'" icon="el-icon-open" type="danger" @click="handleDisable(row)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageWrap>

    <!-- 选择工厂 弹框 -->
    <el-dialog title="选择工厂" top="8vh" :visible.sync="SelectFactoryDialog.visible" width="850px" @closed="closeSelectFactoryDialog">
      <div>
        <!-- 搜索框 -->
        <div class="SelectFactoryDialogSearch">
          <el-input placeholder="输入工厂名称" @keyup.enter.native="SelectFactoryDialogSearch" clearable v-model="SelectFactoryDialog.Search">
            <el-button type="primary" slot="append" icon="el-icon-search" @click="SelectFactoryDialogSearch"></el-button>
          </el-input>
        </div>
        <!-- 表格 -->
        <el-table v-loading="SelectFactoryDialog.tableLoading" height="350px" class="hhy-table" :data="SelectFactoryDialog.TableList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}">
          <el-table-column type="index" label="序号" />
          <el-table-column label="ID" prop="ID" />
          <el-table-column label="工厂" min-width="100" prop="Factory" show-overflow-tooltip />
          <el-table-column label="联系人" min-width="100" prop="Contacts" show-overflow-tooltip />
          <el-table-column label="联系电话" min-width="110" prop="Phone" />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="{row}">
              <el-button type="primary" :disabled="row.isSelect" @click="selFactory(row)">{{row.isSelect?'已选择':'选择'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 选择工厂版型 弹框 -->
    <el-dialog title="选择工厂版型" top="8vh" :visible.sync="SelectFactoryVersionDialog.visible" width="850px" @closed="closeSelectFactoryVersionDialog">
      <el-form ref="SelectFactoryVersionRef" :model="SelectFactoryVersionDialog.Form" :inline="false" label-width="80px">
        <el-form-item label="选择版型" prop="selBx">
          <span v-if="SelectFactoryVersionDialog.selBxList.length==0">{{SelectFactoryVersionDialog.tips}}</span>
          <el-checkbox-group v-else v-model="SelectFactoryVersionDialog.Form.selBx">
            <el-checkbox v-for="i in SelectFactoryVersionDialog.selBxList" :key="i.id" :label="i.name"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="SelectFactoryVersionDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSelectFactoryVersion('SelectFactoryVersionRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CustomizedProducts",
  data() {
    return {
      tableLoading: false, // table 加载状态
      submitLoading: false, // 提交加载状态
      tableDataList: [],
      // 选择工厂弹框相关
      SelectFactoryDialog: {
        visible: false,
        Search: "",
        tableLoading: false,
        TableList: [],
      },
      // 选择工厂版型 弹框相关
      SelectFactoryVersionDialog: {
        visible: false,
        tips: "工厂没有配置版型",
        selBxList: [],
        Form: {
          selBx: ['(YZ-Z01-1)7C'],
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
    },
    readyToWearFilter(readyToWear) {
      const readyToWearMap = {
        "需要设计": 'primary',
        "无需设计": 'info',
      }
      return readyToWearMap[readyToWear]
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
          { id: 1, productImg: 'https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg', productName: '西服', status: '已启用', readyToWear: '需要设计', candidateFactories: [{ name: '北京工厂', format: [] }, { name: '天津工厂', format: [{ name: '(YZ-Z01-1)6C' }, { name: '(YZ-Z01-1)7C' }, { name: '(YZ-Z01-1)7C' }, { name: '(YZ-Z01-1)7C' }] }, { name: '邯郸工厂', format: [{ name: 'A' }, { name: 'B' }] }] },
          { id: 2, productImg: 'https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg', productName: '衬衫', status: '已禁用', readyToWear: '需要设计', candidateFactories: [{ name: '北京工厂', format: [] }] },
          { id: 3, productImg: 'https://www.fabrics-buy.com/API_Upload/Images/Factory/FabricStock/20210826171323_4642.jpg', productName: '衬衫', status: '已禁用', readyToWear: '无需设计', candidateFactories: [{ name: '北京工厂', format: [] }] },
        ];
        this.tableLoading = false;
      }, 500);
    },
    // 关闭选择工厂标签
    handleCloseTag(tagIndex, row) {
      this.$confirm('确认删除制造工厂吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.candidateFactories.splice(tagIndex, 1)
        this.$message.success('删除成功');
        this.initData();
      }).catch(() => { });
    },

    // 打开版式弹框
    openSelectFactoryVersion(row) {
      this.SelectFactoryVersionDialog.visible = true;

      // 选择工厂版型 弹框相关
      this.SelectFactoryVersionDialog.tips = "加载中..."
      setTimeout(() => {
        this.SelectFactoryVersionDialog.selBxList = [{ id: 1, name: '(YZ-Z01-1)8C' }, { id: 2, name: '(YZ-Z01-1)7C' }, { id: 3, name: '(YZ-Z01-1)6C' }]
        this.SelectFactoryVersionDialog.tips = "工厂没有配置版型"
      }, 500);

    },
    // 添加版式弹框 点击确定
    handleSelectFactoryVersion(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.SelectFactoryVersionDialog.visible = false;
            this.submitLoading = false;
            this.$message.success("操作成功")
            this.initData();
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 关闭添加版式弹框
    closeSelectFactoryVersionDialog() {
      this.$refs['SelectFactoryVersionRef'].resetFields();
      this.SelectFactoryVersionDialog.selBxList = []
    },

    // 分配工厂
    handleSelFactory(row) {
      this.SelectFactoryDialog.visible = true;
      this.getSelFactoryData();
    },
    // 选择工厂弹框 查询
    SelectFactoryDialogSearch() {
      this.getSelFactoryData();
    },
    // 获取工厂数据
    getSelFactoryData() {
      this.SelectFactoryDialog.tableLoading = true;
      setTimeout(() => {
        this.SelectFactoryDialog.TableList = [
          { ID: 56, Factory: "北京工厂", Contacts: "张三丰", Phone: "13011053225", isSelect: false },
          { ID: 78, Factory: "上海工厂", Contacts: "张三丰", Phone: "13011053225", isSelect: true },
          { ID: 33, Factory: "天津工厂", Contacts: "张三丰", Phone: "13011053225", isSelect: false },
          { ID: 63, Factory: "南京工厂", Contacts: "张三丰", Phone: "13011053225", isSelect: false },
          { ID: 45, Factory: "山东工厂", Contacts: "张三丰", Phone: "13011053225", isSelect: false },
        ]
        this.SelectFactoryDialog.tableLoading = false;
      }, 500);
    },
    // 选择工厂
    selFactory(row) {
      row.isSelect = true;
    },
    // 关闭选择工厂弹框
    closeSelectFactoryDialog() {
      this.initData();
    },

    // 工艺参数
    handleProcess(row) {
      this.$router.push({ name: 'processParams', params: { id: row.id }, query: { name: row.productName } })
    },

    // 量体参数
    handleVolume(row) {
      this.$router.push({ name: 'volumeParams', params: { id: row.id }, query: { name: row.productName } })
    },
    // 启用
    handleEnable(row) {
      row.status = "已启用"
      this.$message.success('操作成功')
      this.initData();
    },
    // 禁用
    handleDisable(row) {
      row.status = "已禁用"
      this.$message.success('操作成功')
      this.initData();
    },
  }
}
</script>

<style lang="scss" scoped>
.candidateFactories_wrap {
  .el-tag {
    margin-right: 10px;
  }
}
.SelectFactoryDialogSearch {
  width: 300px;
  margin-bottom: 15px;
}
</style>

<style>
/* 候选工厂列hover弹框样式 */
.CandidateFactories_popper {
  padding: 0;
  max-width: 500px !important;
}
.CandidateFactories_popper .content .tit {
  padding: 15px;
  display: inline-block;
  font-weight: bold;
}
.CandidateFactories_popper .content .selFormat {
  margin-right: 5px;
  margin-bottom: 5px;
}
.CandidateFactories_popper .content div {
  border-top: 1px solid #dedede;
  padding: 15px;
}
</style>