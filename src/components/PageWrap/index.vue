<template>
  <div class="fullList" ref="pageWrap">
    <!-- 用于监听hhy-containe宽度变化，重新计算高度 -->
    <object class="objectRef" ref="objectRef" tabindex="-1" type="text/html" aria-hidden="true" data="about:blank">
    </object>

    <!-- 顶部筛选 -->
    <div ref="pageTop">
      <slot name="pageTop"></slot>
    </div>

    <!--表格内容 或者其他-->
    <div ref="pageContent" class="hhy-card">
      <!-- 表格顶部操作菜单 -->
      <div ref="tableMenuBtn">
        <slot name="tableMenuBtn"></slot>
      </div>
      <!-- 表格 -->
      <slot v-bind:contentHeight="contentHeight"></slot>
      <!-- 分页 -->
      <div ref="tablePagination">
        <slot name="tablePagination"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PageWrap",
  data() {
    return {
      time: null,
      contentHeight: null,
      objectRef: null,
    };
  },

  mounted() {
    this.handleResize();

    this.objectRef = this.$refs.objectRef.contentDocument.defaultView;

    this.objectRef.addEventListener("resize", this.debounce(this.handleResize, 500));

    // window.addEventListener("resize", this.debounce(this.handleResize, 500));
  },

  activated() {
    this.objectRef = this.$refs.objectRef.contentDocument.defaultView;

    this.objectRef.addEventListener("resize", this.debounce(this.handleResize, 500));
  },
  deactivated() {
    this.objectRef.removeEventListener("resize", this.handleResize);
  },

  destroyed() {
    // 全局监听事件在离开页面时要注销
    // window.removeEventListener("resize", this.handleResize);
    this.objectRef.removeEventListener("resize", this.handleResize);
  },
  methods: {
    // 防抖
    debounce(fn, delay) {
      return function () {
        if (this.time !== null) {
          clearTimeout(this.time);
        }
        this.time = setTimeout(() => {
          fn.call(this);
        }, delay)
      }
    },

    //内容高度
    handleResize() {
      this.$nextTick(() => {
        try {
          let h1 = this.$refs.pageWrap.offsetHeight;  // 总高度
          let h2 = this.$refs.pageTop.offsetHeight;  // 顶部筛选容器高度
          let h3 = this.$refs.tableMenuBtn.offsetHeight;  // 表格顶部操作按钮高度
          let h4 = this.$refs.tablePagination.offsetHeight;  // 分页
          //   30 padding高度
          let contentHeight = h1 - h2 - h3 - h4 - 30 - 30;
          this.contentHeight = contentHeight;
        } catch (error) {

        }
      })
    },
  },
};
</script>
<style scoped lang="scss">
.fullList {
  height: 100%;
  overflow: hidden;
  .objectRef {
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border: none;
    padding: 0px;
    margin: 0px;
    opacity: 0;
    z-index: -1000;
    pointer-events: none;
  }
}
</style>
