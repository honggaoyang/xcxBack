<template>
  <el-form :model="form" :rules="rules" ref="formRef" class="form_wrap" label-width="100px">
    <el-form-item label="面料分类" prop="fabricGroup">
      <el-checkbox-group :disabled="isEdit||isSearch" v-model="form.fabricGroup">
        <el-checkbox v-for="item in fabricGroupList" :key="item.id" :label="item.name"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="品牌" prop="brand">
          <el-select :disabled="isEdit||isSearch" v-model="form.brand" placeholder="请选择品牌" filterable clearable>
            <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="面料号" prop="fabricNo">
          <el-input :disabled="isEdit||isSearch" v-model="form.fabricNo" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否期货" prop="isForward">
          <el-switch :disabled="isEdit||isSearch" v-model="form.isForward" active-text="是" inactive-text="否">
          </el-switch>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="成本价" prop="costPrice">
          <el-input :disabled="isSearch" v-model="form.costPrice" placeholder="元/米" clearable oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="计价基础价" prop="basisPrice">
          <el-input :disabled="isSearch" v-model="form.basisPrice" placeholder="元" clearable oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="面料成分" prop="composition">
          <el-input :disabled="isEdit||isSearch" v-model="form.composition" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="面料纱织" prop="Saori">
          <el-input :disabled="isEdit||isSearch" v-model="form.Saori" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="克重" prop="weight">
          <el-input :disabled="isEdit||isSearch" v-model="form.weight" placeholder="gms" clearable oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="门幅" prop="doorWidth">
          <el-input :disabled="isEdit||isSearch" v-model="form.doorWidth" placeholder="cm" clearable oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="厚度" prop="thickness">
          <el-select :disabled="isEdit||isSearch" v-model="form.thickness" placeholder="请选择厚度" clearable>
            <el-option v-for="item in thicknessList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="颜色" prop="color">
          <el-input :disabled="isEdit||isSearch" v-model="form.color" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="纹路" prop="lines">
          <el-input :disabled="isEdit||isSearch" v-model="form.lines" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="风格特色" prop="unique">
          <el-input :disabled="isEdit||isSearch" v-model="form.unique" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="图片" prop="imgUrl">
          <myUpload v-model="form.imgUrl"></myUpload>
        </el-form-item>
      </el-col>
      <el-col :span="8">
      </el-col>
    </el-row>

    <el-form-item v-if="!isSearch">
      <el-button type="primary" :loading="submitLoading" @click="submitForm('formRef')">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import myUpload from "@/components/el-upload";  // 上传
export default {
  name: "Form",
  components: {
    myUpload
  },
  props: {
    row: {
      type: Object,
      default: () => { }
    },
    title: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      // 品牌列表
      brandList: [
        { id: 1, name: "世佳宝" }
      ],
      // 面料分类列表
      fabricGroupList: [
        { id: 1, name: '上衣' },
        { id: 2, name: '西裤' },
        { id: 3, name: '马甲' },
        { id: 4, name: '衬衫' },
        { id: 5, name: '大衣' }
      ],
      // 厚度列表
      thicknessList: [
        { id: 1, name: '厚' },
        { id: 2, name: '中等' },
        { id: 3, name: '薄' }
      ],
      form: {
        id: 0,
        brand: "", // 品牌
        fabricGroup: [], // 面料分类
        fabricNo: "", // 面料号
        isForward: false, // 是否期货
        costPrice: "", // 成本价
        basisPrice: "", // 计价基础价
        composition: "", // 面料成分
        Saori: "", // 面料纱织
        weight: "", // 克重
        doorWidth: "", // 门幅
        thickness: "", // 厚度
        color: "", // 颜色
        lines: "", // 纹路
        unique: "", // 风格特色
        imgUrl: "", // 图片
      },
      rules: {
        brand: [
          { required: true, message: '请选择品牌', trigger: 'change' }
        ],
        fabricGroup: [
          { type: 'array', required: true, message: '请选面料分类', trigger: 'change' }
        ],
        fabricNo: [
          { required: true, message: '请输入面料号', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入面料号', trigger: 'blur' }
        ],
        costPrice: [
          { required: true, message: '请输入成本价', trigger: 'blur' },
        ]
      },
      submitLoading: false,
      isEdit: false,
      isSearch: false,
    }
  },
  mounted() {
    if (['编辑', '查看'].includes(this.title)) {
      const { id } = this.row
      this.form = {
        id,
        brand: 1, // 品牌
        fabricGroup: ['马甲', '衬衫'], // 面料分类
        fabricNo: "Bb123", // 面料号
        isForward: false, // 是否期货
        costPrice: "33", // 成本价
        basisPrice: "22", // 计价基础价
        composition: "面料成分", // 面料成分
        Saori: "面料纱织", // 面料纱织
        weight: "11", // 克重
        doorWidth: "12.22", // 门幅
        thickness: 1, // 厚度
        color: '红色', // 颜色
        lines: "无", // 纹路
        unique: "风格特色", // 风格特色
        imgUrl: "", // 图片
      }

      let typeNameMap = {
        '编辑': 'isEdit',
        '查看': 'isSearch'
      }
      this[typeNameMap[this.title]] = true;
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.$emit('submitSuccess')
            this.$message.success('操作成功!')
            this.submitLoading = false;
          }, 500);
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.formRef.resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.form_wrap {
  .el-input {
    width: 170px;
  }
  .el-select {
    width: 170px;
  }
}
</style>