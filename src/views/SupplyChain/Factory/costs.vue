<template>
  <div class="hhy-container costos">
    <div class="hhy-tips">
      <p>衣洲服饰 - 费用设置</p>
    </div>
    <el-tabs class="costos-content" type="border-card">
      <!-- 工艺费用 -->
      <el-tab-pane label="工艺费用" class="TechnologyCost">
        <p class="tips">如需增加收费项，请先到 '定制 - 定制产品 - 工艺参数' 中进行默认费用设置</p>
        <el-table v-loading="TechnologyCost.loading" class="hhy-table" height="300px" :data="TechnologyCost.tableList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="100" />
          <el-table-column label="定制商品" min-width="100" show-overflow-tooltip prop="factoryName" />
          <el-table-column label="工艺" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="工艺选项" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="默认成本" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="结算费用" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="工厂定价" min-width="100" prop="alias" show-overflow-tooltip />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right">
            <template slot-scope="{row}">
              {{row}}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 流程费用 -->
      <el-tab-pane label="流程费用" lazy class="ProcessCost">
        <el-form :model="ProcessCost.Form" label-width="80px">
          <el-form-item label="修改费">
            <el-input clearable v-model="ProcessCost.Form.ModificationFee" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" />元
          </el-form-item>
          <el-form-item label="加急费">
            <el-input clearable v-model="ProcessCost.Form.ExpediteFee" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')" />元 / 天
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-setting" type="primary" @click="setProcessCost">设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 试衣费用 -->
      <el-tab-pane label="试衣费用" lazy class="FittingCost">
        <div class="FittingCost-MenuBox">
          <el-button type="primary" @click="FittingCostDialog.visible=true" icon="el-icon-plus">添加</el-button>
        </div>
        <el-table v-loading="FittingCost.loading" class="hhy-table" height="300px" :data="FittingCost.tableList" element-loading-text="加载中..." stripe :header-cell-style="{textAlign: 'center'}" :cell-style="{textAlign: 'center'}">
          <!-- 序号 -->
          <el-table-column type="index" label="序号" width="100" />
          <el-table-column label="定制商品" min-width="100" show-overflow-tooltip prop="factoryName" />
          <el-table-column label="工艺" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="工艺选项" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="半成品试衣" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="代料试衣" min-width="100" prop="alias" show-overflow-tooltip />
          <el-table-column label="毛壳试衣" min-width="100" prop="alias" show-overflow-tooltip />
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right">
            <template slot-scope="{row}">
              {{row}}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 指定工艺供应商 -->
    <el-dialog title="指定工艺供应商" :visible.sync="FittingCostDialog.visible" width="450px" @closed="closeFittingCostDialog">
      <el-form :model="FittingCostDialog.Form" :rules="FittingCostDialog.Rules" ref="FittingCostRef" label-width="90px">
        <el-form-item label="定制商品" prop="CustomizedProducts">
          <el-select clearable v-model="FittingCostDialog.Form.CustomizedProducts" placeholder="选择定制商品">
            <el-option v-for="item in FittingCostDialog.CustomizedProductsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺" prop="Technology">
          <el-select clearable v-model="FittingCostDialog.Form.Technology" placeholder="选择工艺">
            <el-option v-for="item in FittingCostDialog.TechnologyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工艺选项" prop="TechnologyOption">
          <el-select clearable v-model="FittingCostDialog.Form.TechnologyOption" placeholder="选择工艺选项">
            <el-option v-for="item in FittingCostDialog.TechnologyOptionList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="半成品试衣" prop="SemiFinishedFitting">
          <el-input clearable placeholder="单位(元)" v-model="FittingCostDialog.Form.SemiFinishedFitting" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
        <el-form-item label="代料试衣" prop="SubstituteFitting">
          <el-input clearable placeholder="单位(元)" v-model="FittingCostDialog.Form.SubstituteFitting" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
        <el-form-item label="毛壳费用" prop="ShellCost">
          <el-input clearable placeholder="单位(元)" v-model="FittingCostDialog.Form.ShellCost" oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="FittingCostDialog.visible = false">取 消</el-button>
        <el-button :loading="FittingCostDialog.submitLoading" type="primary" @click="handleSubmitFittingCost('FittingCostRef')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "FactoryCosts",
  data() {
    return {

      // 工艺费用
      TechnologyCost: {
        tableList: [],
        loading: false,
      },

      // 流程费用  
      ProcessCost: {
        Form: {
          ModificationFee: 0, // 修改费用
          ExpediteFee: 0, // 加急费用
        }
      },

      // 试衣费用
      FittingCost: {
        tableList: [],
        loading: false,
      },

      // 试衣费用 添加弹框
      FittingCostDialog: {
        visible: false,
        CustomizedProductsList: [{ id: 1, name: '马甲' }], // 定制商品列表
        TechnologyList: [{ id: 1, name: '工艺' }], // 工艺列表
        TechnologyOptionList: [{ id: 1, name: '工艺选项' }], // 工艺选项列表
        Form: {
          CustomizedProducts: "", // 定制商品
          Technology: "", // 工艺
          TechnologyOption: "", // 工艺选项
          SemiFinishedFitting: "", // 半成品试衣
          SubstituteFitting: "", // 代料试衣
          ShellCost: "",// 毛壳费用
        },
        submitLoading: false, // 提交按钮loading
        Rules: {
          CustomizedProducts: [
            { required: true, message: '请选择定制商品', trigger: 'change' }
          ],
          Technology: [
            { required: true, message: '请选择工艺', trigger: 'change' }
          ],
          TechnologyOption: [
            { required: true, message: '请选择工艺选项', trigger: 'change' }
          ],
        }
      }
    }
  },
  mounted() {
    console.log(this.$route.query.id);
  },
  methods: {
    // 设置流程费用
    setProcessCost() {
      this.$message.success("设置成功")
    },

    // 试衣费用-弹框保存
    handleSubmitFittingCost(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.FittingCostDialog.submitLoading = true;
          setTimeout(() => {
            this.FittingCostDialog.submitLoading = false;
            this.FittingCostDialog.visible = false;
            this.$message.success('添加成功')
          }, 500);
        } else {
          return false;
        }
      });
    },

    // 试衣费用-关闭弹框
    closeFittingCostDialog() {
      this.$refs.FittingCostRef.resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
// 标题
.costos {
  &-title {
    font-size: 16px;
    margin-bottom: 15px;
  }
}

//工艺费用
.TechnologyCost {
  .tips {
    margin-top: 0;
  }
}

// 流程费用
.ProcessCost {
  .el-input {
    width: 120px;
    margin-right: 5px;
  }
}

// 试衣费用
.FittingCost {
  &-MenuBox {
    margin-bottom: 15px;
  }
}
</style>