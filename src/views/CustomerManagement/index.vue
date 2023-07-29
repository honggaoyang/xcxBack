<template>
  <div class="hhy-container">
    <PageWrap>
      <!-- 顶部筛选容器哦 -->
      <template #pageTop>
        <el-form inline :model="searchForm" ref="searchForm" class="hhy-card hhy-topSearch-box">
          <el-form-item label="客户" prop="custom">
            <el-input v-model="searchForm.custom" clearable placeholder="客户" @keyup.enter.native="initData"></el-input>
          </el-form-item>
          <el-form-item label="门店" prop="store">
            <el-select v-model="searchForm.store" placeholder="门店">
              <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="initData" type="primary" class="hhy-search-btn" round>查询</el-button>
            <el-button @click="resetSearchForm('searchForm')" type="danger" class="hhy-reset-btn" round>重置</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 表格 -->
      <template v-slot:default="slotProps">
        <el-table v-loading="tableLoading" ref="tableDataRef" class="hhy-table" :height="slotProps.contentHeight" :data="tableDataList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}"
          :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" :index="indexMethod" />
          <el-table-column label="客户" style="text-algin:left" show-overflow-tooltip min-width="150">

            <template slot-scope="{row}">
              <div class="custom">
                <div><svg-icon class="custom-head" :icon-class="row.gender=='男'?'MaleAvatar':'FemaleAvatar'" /></div>
                <div>
                  <div><el-tag><svg-icon class="custom-store" icon-class="store" />{{row.store}}</el-tag></div>
                  <div>{{row.custom}}<svg-icon class="custom-gender" :icon-class="row.gender=='男'?'male':'female'" /></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="消费次数" min-width="120" show-overflow-tooltip prop="consumeCount" />
          <el-table-column label="消费金额" min-width="120" show-overflow-tooltip prop="consumeAmount" />
          <el-table-column label="上次消费时间" min-width="120" show-overflow-tooltip prop="consumeDate" />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="{row}">
              <router-link :to="'/CustomerManagement/detail/'+row.id">
                <el-button icon="el-icon-search" type="primary">查看</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <template #tablePagination>
        <myPagination :pager="pager" @query="initData" />
      </template>
    </PageWrap>
  </div>
</template>

<script>
export default {
  name: 'CustomerManagement',
  data() {
    return {
      storeList: [
        { id: 1, name: '全部' },
        { id: 2, name: '南京店' },
        { id: 3, name: '北京店' },
      ],
      searchForm: {
        custom: "", // 客户
        store: 1, // 门店
      },
      tableLoading: false, // table 加载状态
      tableDataList: [],
      // 分页数据 传给子组件
      pager: {
        count: 100,
        page: 1,
        rows: 15,
        checkNum: 0,
      },
    }
  },
  created() {
    // 初始化数据
    this.initData()
  },
  methods: {
    // 重置查询表单
    resetSearchForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 初始化数据
    initData() {
      this.tableLoading = true;
      setTimeout(() => {
        this.tableDataList = [
          {
            id: 1, custom: '张无忌', store: '北京店北京店', gender: '男', consumeCount: "12", consumeAmount: "¥100.22", consumeDate: '2023-06-06 12:12',
          },
          {
            id: 2, custom: '赵敏', store: '海南店', gender: '女', consumeCount: "12", consumeAmount: "¥100.22", consumeDate: '2023-06-06 12:12',
          },
          {
            id: 3, custom: '张三丰', store: '海南店', gender: '女', consumeCount: "12", consumeAmount: "¥100.22", consumeDate: '2023-06-06 12:12',
          },
          {
            id: 4, custom: '赵敏', store: '海南店', gender: '女', consumeCount: "12", consumeAmount: "¥100.22", consumeDate: '2023-06-06 12:12',
          },
        ]
        this.tableLoading = false;
      }, 500);

    },
    // 表格每隔一页递增
    indexMethod(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
  },
  activated() {
    // 解决fixed 固定列错位bug
    this.$refs.tableDataRef.doLayout();
  },

}
</script>

<style scoped lang="scss">
.custom {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  text-align: left;
  padding-left: 50px;
  &-head {
    width: 48px;
    height: 48px;
  }
  &-store {
    margin-right: 3px;
  }
  &-gender {
    margin-left: 5px;
  }
  > div {
    line-height: 0;
    &:nth-child(2) {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}
</style>