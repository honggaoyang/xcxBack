<template>
  <div class="hhy-container">
    <el-card class="card">
      <div slot="header" class="card-head">
        <span>订单号: WZNJ10277230728115907</span>
      </div>
      <div>
        <h3>已向工厂下制衣单，等待工厂制造</h3>
        <p>请及时跟踪工厂制造进度，必要时进行催单。</p>
        <div class="steps-wrap">
          <el-steps :active="active" finish-status="success">
            <el-step title="买家下单" description="2023-07-29 13:46:33"></el-step>
            <el-step title="买家付款" description="2023-07-30 13:46:33"></el-step>
            <el-step title="商家发货"></el-step>
            <el-step title="交易完成"></el-step>
          </el-steps>
        </div>
      </div>
    </el-card>
    <el-card class="card">
      <div slot="header" class="card-head">
        <span>物流信息</span>
      </div>
      <div class="Logistics_info_wrap">
        <p>客户：<el-link type="primary" @click="$router.push('/CustomerManagement/detail/1')">张三丰</el-link></p>
        <p>联系电话：13000000000</p>
        <p>配送方式：上面自提</p>
        <p>实付金额：1000.25</p>
        <p>付款方式：微信支付</p>
        <p>付款时间：2023-12-10 12:12:12</p>
        <p>买家留言:-</p>
      </div>
    </el-card>
    <el-card class="card">
      <div slot="header" class="card-head">
        <span>交易信息</span>
      </div>
      <div>
        <el-table class="hhy-table" :data="tableDataList" stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="发货单" min-width="180">
            <template slot-scope="{row}">
              <div class="table_title">
                <span>单号：{{row.orderNumber}}</span><el-tag :type="row.type | statusFilter">{{row.type}}</el-tag>
              </div>
              <div class="table_wrap">
                <div>
                  <el-image :src="row.image" :preview-src-list="[row.image]"> </el-image>
                </div>
                <div>
                  <span>{{row.name}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" show-overflow-tooltip>
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">{{row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="单价(元)" prop="price" show-overflow-tooltip></el-table-column>
          <el-table-column label="数量" prop="number" show-overflow-tooltip></el-table-column>
          <el-table-column label="优惠(元)" prop="preferential" show-overflow-tooltip></el-table-column>
          <el-table-column label="小计(元)" prop="subtotal" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="footer_info">
          <p>商品总价:<span>￥11048.4</span></p>
          <p>优惠:<span>￥0.00</span></p>
          <p>实收金额：<span>￥11048.4</span></p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "OrderDetails",
  data() {
    return {
      active: 2,
      tableDataList: [],
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "买家下单": 'primary',
        "买家付款": 'warning',
        "商家发货": 'primary',
        "交易完成": 'success',
        "定制": "warning",
        "成品": "success",
        "租赁": "danger",
      }
      return statusMap[status]
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.$message.success(`当前ID为${id}`)
    // 获取交易数据
    this.getTransactionData()
  },
  methods: {
    getTransactionData() {
      this.tableDataList = [
        { id: 1, orderNumber: 'WZNJ08870230628150748-1', type: "定制", image: 'http://resource.vxiaocheng.com/dust/assets/img/suit_logo.png', name: '上衣', status: '商家发货', price: 11048.40, number: 1, preferential: 0.00, subtotal: 11048.40, }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  margin-top: 15px;
  .card-head {
    font-size: 16px;
  }
  .steps-wrap {
    width: 80%;
    margin: 50px 0 20px;
  }
}

.table_title {
  text-align: left;
  margin-bottom: 5px;
  span {
    margin-right: 10px;
  }
}
.table_wrap {
  display: flex;
  gap: 10px;
  .el-image {
    width: 80px;
    height: 80px;
  }
}
.Logistics_info_wrap {
  p {
    display: flex;
    align-items: center;
  }
}
.footer_info {
  // text-align: right;
  p {
    span {
      display: inline-block;
      text-align: right;
      // width: 100px;
    }
    &:nth-child(3) {
      font-size: 18px;
      span {
        color: #f56c6c;
      }
    }
  }
}
</style>