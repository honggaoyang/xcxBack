<template>
  <div class="hhy-container">
    <div class="hhy-card product_wrap">
      <el-form ref="FinishedProductRef" :model="FinishedProductForm" :inline="false" :rules="FinishedProductRules" label-width="100px">
        <div class="hhy-tips">
          <p>基本信息</p>
        </div>
        <el-form-item label="服装品类" prop="Product">
          <el-select v-model="FinishedProductForm.Product" placeholder="请选择服装品类" filterable clearable>
            <el-option v-for="item in ProductList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成品名" prop="FinishedProductName">
          <el-input maxlength="30" clearable placeholder="成品名是助记的名字" v-model="FinishedProductForm.FinishedProductName"></el-input>
        </el-form-item>
        <el-form-item label="促销标题" prop="PromotionTitle">
          <el-input maxlength="30" clearable placeholder="在小程序上展示的成品标题" v-model="FinishedProductForm.PromotionTitle"></el-input>
        </el-form-item>
        <el-form-item label="成品货号" prop="ArtNo">
          <el-input maxlength="30" clearable placeholder="编号是制衣单中携带的信息" v-model="FinishedProductForm.ArtNo"></el-input>
        </el-form-item>
        <el-form-item label="小程序预约" prop="Reservation">
          <el-switch v-model="FinishedProductForm.Reservation" active-text="是" inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="缩略图" prop="ThumbnailUrl">
          <myUpload v-model="FinishedProductForm.ThumbnailUrl"></myUpload>
        </el-form-item>
        <el-form-item label="轮播图" prop="SwiperUrl">
          <myUploadMore v-model="FinishedProductForm.SwiperUrl" />
        </el-form-item>
        <div class="hhy-tips">
          <p>套装组合</p>
        </div>
        <el-button type="primary" icon="el-icon-plus" @click="openclothingDialog">添加成衣</el-button>
        <el-table class="hhy-table" height="300" :data="FinishedProductForm.clothingDataList" stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="成衣" show-overflow-tooltip prop="title"></el-table-column>
          <el-table-column label="货号" show-overflow-tooltip prop="artNo"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-popconfirm title="确定要删除吗？" @confirm="delSelColthing(scope.row,scope.$index)" @onConfirm="delSelColthing(scope.row,scope.$index)">
                <el-button slot="reference" icon="el-icon-delete" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="hhy-tips">
          <p>价格信息</p>
        </div>
        <el-form-item label="售价" prop="Price">
          <el-input clearable placeholder="售价" v-model="FinishedProductForm.Price" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
        <div class="hhy-tips">
          <p>图文详情</p>
        </div>
        <el-form-item class="NoLabel" prop="ContentDetail">
          <Tinymce ref="editor" v-model="FinishedProductForm.ContentDetail" :height="400" />
        </el-form-item>
        <el-form-item class="footerBtn">
          <el-button @click="resetForm('FinishedProductRef')">重置</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submitForm('FinishedProductRef')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 添加成衣 弹框 -->
    <el-dialog title="添加成衣" top="8vh" :visible.sync="clothingDialog.visible" width="850px" @closed="closeClothingDialog">
      <div>
        <!-- 搜索框 -->
        <div class="clothingSearch_wrap">
          <div>
            <el-input placeholder="输入货号" @keyup.enter.native="getClothingData" clearable v-model="clothingDialog.gic">
              <el-button type="primary" slot="append" icon="el-icon-search" @click="getClothingData"></el-button>
            </el-input>
          </div>
          <span>选中{{currSelNumber}}件</span>
        </div>
        <div class="clothingCont_wrap" v-loading="clothingDialog.loading" element-loading-text="拼命加载中">
          <div class="item" :class="{active:item.isChecked}" @click="item.isChecked=!item.isChecked" v-for="item in clothingDialog.dataList" :key="item.id">
            <el-image :src="item.imgUrl" fit="cover"></el-image>
            <div class="text">
              <p>{{item.title}}</p>
              <p>货号：{{item.artNo}}</p>
            </div>
          </div>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>

      <span slot="footer">
        <el-button @click="clothingDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitSelClothingData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myUpload from "@/components/el-upload";  // 上传
import myUploadMore from "@/components/el-uploadMore";  // 上传多张
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    myUpload,
    myUploadMore,
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
      // 服装品类
      ProductList: [
        { id: 1, name: '上衣' },
        { id: 2, name: '西裤' },
        { id: 3, name: '马甲' }
      ],
      submitLoading: false, // 提交按钮 
      FinishedProductForm: {
        Product: "", // 服装品类
        FinishedProductName: "", // 成品名称
        PromotionTitle: "", // 促销标题
        ArtNo: "", // 成品货号
        Reservation: true, // 小程序预约
        ThumbnailUrl: "", // 缩略图
        SwiperUrl: [], // 轮播图
        clothingDataList: [], // 成衣列表
        Price: "", // 售价
        ContentDetail: "", // 图文详情
      },
      FinishedProductRules: {
        Product: [
          { required: true, message: '请选择服装品类', trigger: 'change' }
        ],
        FinishedProductName: [
          { required: true, message: '请输入成品名称', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入成品名称', trigger: 'blur' }
        ],
        ArtNo: [
          { required: true, message: '请输入成品货号', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入成品货号', trigger: 'blur' }
        ],
        // ThumbnailUrl: [
        //   { required: true, message: '请上传缩略图', trigger: 'change' },
        // ]
        Price: [
          { required: true, message: '请输入售价', trigger: 'blur' },
        ]
      },
      clothingList: [], // 成衣列表
      // 添加成衣弹框
      clothingDialog: {
        visible: false,
        gic: "", // 搜索内容
        loading: false,
        dataList: [],
      }

    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.$message.success(`当前ID为${id}`)
    }
  },
  computed: {
    // 获取添加成衣弹框里面选中的数据
    currSelNumber() {
      return this.clothingDialog.dataList.filter(v => v.isChecked).length
    }
  },
  methods: {
    // 打开成衣弹框
    openclothingDialog() {
      this.clothingDialog.visible = true;
      this.getClothingData();
    },
    // 获取成衣弹框数据
    getClothingData() {
      this.clothingDialog.dataList = [];
      this.clothingDialog.loading = true;
      setTimeout(() => {
        this.clothingDialog.dataList = [
          { id: 1, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, price: '111.00', title: '修身西服2023春季新款修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 2, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, price: '222.00', title: '修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 3, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, price: '333.00', title: '修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 4, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, price: '123.00', title: '修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 5, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, price: '123.00', title: '修身西服2023春季新款', artNo: 'xsxfcjxk' },
          { id: 6, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, price: '123.00', title: '修身西服2023春季新款', artNo: 'xsxfcjxk' }
        ];
        this.clothingDialog.loading = false;
      }, 500);
    },
    // 成衣弹框 确定
    submitSelClothingData() {
      let selList = this.clothingDialog.dataList.filter(v => v.isChecked)
      selList.forEach((v) => {
        this.FinishedProductForm.clothingDataList.push(v)
      })
      this.clothingDialog.visible = false
    },
    // 关闭成衣弹框
    closeClothingDialog() {

    },
    // 删除选中的成衣
    delSelColthing(row, index) {
      this.FinishedProductForm.clothingDataList.splice(index, 1);
    },
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
            // 关闭之后跳转你要跳转的路由
            this.$router.push({ path: '/FinishedProductManagement/FinishedProductManage' })
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
  .hhy-table {
    margin: 15px 0;
  }
  .footerBtn {
    text-align: right;
  }
}
</style>
<style lang="scss">
.product_wrap {
  .NoLabel {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}

// 成衣弹框搜索
.clothingSearch_wrap {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  span {
    margin-left: 15px;
  }
}
// 成衣弹框内容
.clothingCont_wrap {
  height: 300px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding-right: 20px;
  .item {
    width: 180px;
    height: auto;
    border: 1px solid #dedede;
    overflow: hidden;
    cursor: pointer;
    .el-image {
      width: 180px;
      height: 200px;
    }
    .text {
      p {
        padding: 10px;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis;
        &:nth-child(2) {
          padding-top: 0;
        }
      }
    }
  }
  i {
    width: 180px;
  }
  .item.active {
    border: 1px solid #409eff;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      border: 25px solid #409eff;
      border-top-color: transparent;
      border-left-color: transparent;
    }
    &::after {
      content: "";
      width: 10px;
      height: 20px;
      position: absolute;
      right: 8px;
      bottom: 8px;
      border: 2px solid #fff;
      border-top-color: transparent;
      border-left-color: transparent;
      transform: rotate(45deg);
    }
  }
}
</style>