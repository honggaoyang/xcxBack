<template>
  <div class="pager_wrap" :style="{justifyContent: !isShowCheckNum?'flex-end':''}">
    <span class="select_text" v-if="isShowCheckNum">
      已经选择{{ pager[props.checkNum] }}项
    </span>
    <el-pagination background class="pagination" layout="total, sizes, prev, pager, next, jumper" :pager-count="7" :total="pager[props.total]" :current-page.sync="pager[props.page]" :page-size="pager[props.rows]" :page-sizes="pageSizes"
      @size-change="onChangeSize" @current-change="onChangePage"></el-pagination>
  </div>
</template>

<script>
export default {
  name: "Paging",
  // 设置绑定参数
  model: {
    prop: "pager",
    event: "setPager",
  },
  props: {
    isShowCheckNum: {
      type: Boolean,
      default: false,
    },
    pager: {
      type: Object,
      required: true,
    },
    refresh: {
      type: Boolean,
    },
    pageSizes: {
      type: Array,
      default: () => [5, 15, 20, 30, 50],
    },

    props: {
      type: Object,
      required: false,
      default: () => ({
        // 第几页
        page: "page",
        // 显示条数
        rows: "rows",
        // 总记录条数
        total: "count",
        //
        checkNum: "checkNum",
      }),
    },
  },
  computed: {
    total() {
      return this.pager[this.props.total] || 0;
    },
    // 检测获取到的数据是否为空
    isEmptyList() {
      return (
        Math.ceil(this.pager[this.props.total] / this.pager[this.props.rows]) <
        this.pager[this.props.page]
      );
    },
  },
  watch: {
    total() {
      // 存在记录但未获取到数据时, 重新请求
      if (this.pager[this.props.page] > 1 && this.isEmptyList) {
        this.$emit(
          "setPager",
          Object.assign(this.pager, {
            [this.props.page]: this.pager[this.props.page] - 1,
          })
        );
        this.$nextTick(() => {
          this.$emit("query");
        });
      }
    },
  },
  methods: {
    // 序号每隔一页递增
    indexMethod(index) {
      return (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1
    },
    // 每页条数
    onChangeSize(rows) {
      const temp = {
        [this.props.rows]: rows,
        // 当显示条数小于或等于总条数时，重置页数
        [this.props.page]: rows <= this.total ? 1 : this.pager[this.props.page],
      };

      this.$emit("setPager", Object.assign(this.pager, temp));
      // 触发父组件查询请求
      this.$nextTick(() => {
        this.$emit("query");
      });
    },
    // 翻页
    onChangePage(page) {
      this.$emit(
        "setPager",
        Object.assign(this.pager, { [this.props.page]: page })
      );
      this.$emit("query");
    },
  },
};
</script>

<style lang="scss" scoped>
.pager_wrap {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: space-between;
  padding-top: 15px;
  .select_text {
    color: #666666;
  }
}
</style>
