<template>
  <div class="hhy-container">
    <div class="hhy-card product_wrap">
      <el-form ref="TransferFormRef" :model="TransferForm" :inline="false" :rules="TransferFormRules" label-width="100px">
        <div class="hhy-tips">
          <p>发起调拨</p>
        </div>
        <el-form-item label="发货门店" prop="fhStore">
          <el-select v-model="TransferForm.fhStore" placeholder="请选择发货门店" filterable clearable>
            <el-option v-for="item in fhStoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货门店" prop="shStore">
          <el-select v-model="TransferForm.shStore" placeholder="请选择收货门店" filterable clearable>
            <el-option v-for="item in shStoreList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="openclothingDialog">添加成衣</el-button>
        <el-table class="hhy-table" height="300" :data="TransferForm.clothingDataList" stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column label="成衣" show-overflow-tooltip prop="title"></el-table-column>
          <el-table-column label="货号" show-overflow-tooltip prop="artNo"></el-table-column>
          <el-table-column label="规格">
            <template slot-scope="{row}">
              <el-tag>{{row.specifications}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="采购价" prop="purchasePrice"></el-table-column>
          <el-table-column label="库存">
            <template slot-scope="{row}">
              <el-tag type="warning" v-for="i,index in row.inventory" :key="index">{{i.brand}}：{{i.num}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="购买量" prop="PurchaseQuantity"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button icon="el-icon-setting" @click="openSetNumberDialog(scope.row)" type="primary" style="margin-right:10px;">调整数量</el-button>
              <el-popconfirm title="确定要删除吗？" @confirm="delSelColthing(scope.row,scope.$index)" @onConfirm="delSelColthing(scope.row,scope.$index)">
                <el-button slot="reference" icon="el-icon-delete" type="danger">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item class="footerBtn">
          <el-button @click="resetForm('TransferFormRef')">重置</el-button>
          <el-button v-if="TransferForm.clothingDataList.length>0" type="primary" :loading="submitLoading" @click="submitForm('TransferFormRef')">提交调拨</el-button>
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
              <p>规格：<el-tag>{{item.specifications}}</el-tag></p>
              <p>库存：{{item.inventory.map(e=>e.num).reduce((a,b)=> a+b,0)}}</p>
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

    <!-- 调整数量 -->
    <el-dialog title="编辑成衣数量" top="8vh" :visible.sync="setNumberDialog.visible" width="550px" @closed="closeSetNumberDialog">
      <el-form ref="setNumberRef" :model="setNumberDialog.setNumberForm" :inline="false" :rules="setNumberDialog.Rules" label-width="100px">
        <el-form-item label="成衣">
          {{setNumberDialog.setNumberForm.name}}
          <el-tag> {{setNumberDialog.setNumberForm.color}}</el-tag>
        </el-form-item>
        <el-form-item label="库存">
          {{setNumberDialog.setNumberForm.inventory}}
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input style="width:90px" maxlength="5" v-model="setNumberDialog.setNumberForm.number" clearable oninput="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="setNumberDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="handleSetNumber('setNumberRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AddTransferOrder",
  data() {
    return {
      submitLoading: false, // 提交按钮 
      fhStoreList: [{ id: 1, name: '北京店' }],
      shStoreList: [{ id: 1, name: '南京店' }],
      TransferForm: {
        fhStore: "",
        shStore: "",
        clothingDataList: [],
      },
      TransferFormRules: {
        fhStore: [
          { required: true, message: '请选择发货门店', trigger: 'change' }
        ],
        shStore: [
          { required: true, message: '请选择收货门店', trigger: 'change' }
        ],
      },
      // 添加成衣弹框
      clothingDialog: {
        visible: false,
        gic: "", // 搜索内容
        loading: false,
        dataList: [],
      },
      // 调整数量弹框
      setNumberDialog: {
        visible: false,
        setNumberForm: {
          id: "",
          name: "",
          color: "",
          inventory: "",
          number: "",
        },
        Rules: {
          number: [
            { required: true, message: '请输入调整数量', trigger: 'blur' },
          ]
        }
      }
    }
  },
  computed: {
    // 获取添加成衣弹框里面选中的数据
    currSelNumber() {
      return this.clothingDialog.dataList.filter(v => v.isChecked).length
    }
  },
  methods: {
    //   打开添加成衣弹框
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
          { id: 1, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, title: '修身西服2023春季新款修身西服2023春季新款', artNo: 'xsxfcjxk', specifications: '黄色 41', purchasePrice: '11.22', inventory: [{ brand: '北京店', num: 10 }], PurchaseQuantity: '13' },
          { id: 2, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, title: '修身西服2023春季新款', artNo: 'xsxfcjxk', specifications: '黄色 41', purchasePrice: '11.22', inventory: [{ brand: '北京店', num: 10 }, { brand: '上海店', num: 5 }], PurchaseQuantity: '53' },
          { id: 3, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, title: '修身西服2023春季新款', artNo: 'xsxfcjxk', specifications: '黄色 41', purchasePrice: '11.22', inventory: [{ brand: '北京店', num: 10 }], PurchaseQuantity: '11' },
          { id: 4, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, title: '修身西服2023春季新款', artNo: 'xsxfcjxk', specifications: '黄色 41', purchasePrice: '11.22', inventory: [{ brand: '北京店', num: 10 }], PurchaseQuantity: '32' },
          { id: 5, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, title: '修身西服2023春季新款', artNo: 'xsxfcjxk', specifications: '黄色 41', purchasePrice: '11.22', inventory: [{ brand: '北京店', num: 10 }], PurchaseQuantity: '56' },
          { id: 6, imgUrl: 'https://chenjiedingzhi.oss-cn-shanghai.aliyuncs.com/upload/ginger_image/1/2023_04_21_14_16_07.09604.jpg', isChecked: false, title: '修身西服2023春季新款', artNo: 'xsxfcjxk', specifications: '黄色 41', purchasePrice: '11.22', inventory: [{ brand: '北京店', num: 10 }], PurchaseQuantity: '140' }
        ];
        this.clothingDialog.loading = false;
      }, 500);
    },
    // 成衣弹框 确定
    submitSelClothingData() {
      let selList = this.clothingDialog.dataList.filter(v => v.isChecked)
      selList.forEach((v) => {
        if (!this.TransferForm.clothingDataList.some(z => z.id == v.id)) {
          this.TransferForm.clothingDataList.push(v)
        }
      })
      this.clothingDialog.visible = false
    },
    // 关闭成衣弹框
    closeClothingDialog() {

    },
    // 打开调整数量弹框
    openSetNumberDialog(row) {
      this.setNumberDialog.visible = true;
      this.setNumberDialog.setNumberForm.id = row.id;
      this.setNumberDialog.setNumberForm.name = row.title;
      this.setNumberDialog.setNumberForm.color = row.specifications;
      this.setNumberDialog.setNumberForm.inventory = row.inventory.map(e => e.num).reduce((a, b) => a + b, 0);
      this.setNumberDialog.setNumberForm.number = row.PurchaseQuantity;
    },
    // 打开调整数量弹框 点击确定按钮
    handleSetNumber(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {

            // 更新修改的数量
            let id = this.setNumberDialog.setNumberForm.id
            this.TransferForm.clothingDataList.find(v => v.id == id).PurchaseQuantity = this.setNumberDialog.setNumberForm.number;

            this.submitLoading = false;
            this.setNumberDialog.visible = false;
            this.$message.success('调整成功')
          }, 500);
        } else {
          return false;
        }
      })
    },
    // 关闭调整数量弹框
    closeSetNumberDialog() {
      this.$refs['setNumberRef'].resetFields();
    },

    // 删除选中的成衣
    delSelColthing(row, index) {
      this.TransferForm.clothingDataList.splice(index, 1);
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
            this.$router.push({ path: '/FinishedProductManagement/TransferOrder' })
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
  .hhy-table {
    margin: 15px 0;
  }
  .footerBtn {
    text-align: right;
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
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      p {
        padding: 0 10px;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        word-break: break-all;
        text-overflow: ellipsis;
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