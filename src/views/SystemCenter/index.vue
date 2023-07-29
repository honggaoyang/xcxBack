<template>
  <div class="hhy-container">
    <!-- 系统中心 -->
    <el-card class="card_wrap">
      <div slot="header" class="head">
        <span>系统中心</span>
      </div>
      <div class="cont">
        <div>乔丹品牌</div>
        <div>账户号：123456789
          <el-tooltip class="item" effect="dark" content="您可使用 账户号+密码 登录系统" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
        <div>注册手机号：<el-link type="primary" @click="EditPhoneDialog.visible=true">更改手机号</el-link></div>
        <div>三方工厂制衣单推送地址：<el-link type="primary" @click="ChangeAddressDialog.visible=true">更改推送地址</el-link></div>
      </div>
    </el-card>
    <!-- 版本信息 -->
    <el-card class="card_wrap">
      <div slot="header" class="head">
        <span>版本信息</span>
      </div>
      <div class="cont">
        <div>系统版本：品牌版 <el-link type="primary" @click="handleUpgradation">升级</el-link></div>
        <div>开通时间：2023-01-02</div>
        <div>到期时间：2055-01-02</div>
        <div>版本号：2.0</div>
      </div>
    </el-card>
    <!-- 意见反馈 -->
    <el-card class="card_wrap">
      <div slot="header" class="head">
        <span>意见反馈 </span>
      </div>
      <div class="cont">
        <el-form :model="feedbackForm" :rules="feedbackRules" ref="feedbackRef" label-width="80px">
          <el-form-item label="反馈类型" prop="type">
            <el-radio-group v-model="feedbackForm.type">
              <el-radio :label="1">账号问题</el-radio>
              <el-radio :label="2">产品建议</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="问题描述" prop="desc">
            <el-input maxlength="500" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="输入问题描述" v-model="feedbackForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="url">
            <myUploadMore v-model="feedbackForm.url" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFeedbackForm('feedbackRef')">提交</el-button>
            <el-button @click="resetFeedbackForm('feedbackRef')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 更改手机号弹框 -->
    <el-dialog title="修改手机号" :visible.sync="EditPhoneDialog.visible" width="450px" @closed="closeEditPhoneDialog">
      <el-form :model="EditPhoneDialog.Form" :rules="EditPhoneDialog.Rules" ref="EditPhoneDialogRef" label-width="80px">
        <el-form-item label="手机号" prop="phone">
          <el-input maxlength="11" clearable placeholder="输入手机号" v-model="EditPhoneDialog.Form.phone" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="sendCode_wrap">
            <div>
              <el-input maxlength="6" clearable placeholder="输入验证码" v-model="EditPhoneDialog.Form.code" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
            </div>
            <div>
              <el-button @click="sendCode" :disabled="EditPhoneDialog.btnOptFlag" type="primary">{{EditPhoneDialog.codeBtnText}}</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="EditPhoneDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitEditPhone('EditPhoneDialogRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更改推送地址弹框 -->
    <el-dialog title="设置三方工厂制衣单推送地址" :visible.sync="ChangeAddressDialog.visible" width="450px" @closed="closeChangeAddressDialog">
      <el-form :model="ChangeAddressDialog.Form" :rules="ChangeAddressDialog.Rules" ref="ChangeAddressDialogRef" label-width="80px">
        <el-form-item label="三方地址" prop="address">
          <el-input maxlength="30" clearable placeholder="输入三方地址" v-model="ChangeAddressDialog.Form.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="ChangeAddressDialog.visible = false">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submitChangeAddress('ChangeAddressDialogRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myUploadMore from "@/components/el-uploadMore";  // 上传多张
export default {
  name: "SystemCenter",
  components: {
    myUploadMore,
  },
  data() {
    return {
      submitLoading: false,
      // 反馈
      feedbackForm: {
        type: 1,
        desc: "",
        url: [],
      },
      // 反馈验证规则
      feedbackRules: {
        desc: [
          { required: true, message: '请输入问题描述', trigger: 'blur' },
          { pattern: /\S+/, message: '请输入问题描述', trigger: 'blur' }
        ]
      },
      // 修改手机号
      EditPhoneDialog: {
        visible: false,
        Form: {
          phone: "",
          code: "",
        },
        btnOptFlag: false, //获取验证码按钮禁用标识
        codeBtnText: '获取验证码',
        outTime: 60, // 设置发送验证码倒计时时间
        timer: null,
        Rules: {
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ]
        },
      },

      // 更改推送地址弹框
      ChangeAddressDialog: {
        visible: false,
        Form: {
          address: "",
        },
        Rules: {
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' },
            { pattern: /\S+/, message: '请输入地址', trigger: 'blur' }
          ],
        },
      }
    }
  },
  methods: {
    // 提交反馈
    submitFeedbackForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message.success('提交成功')
          this.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },
    // 重置反馈
    resetFeedbackForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 升级
    handleUpgradation() {
      this.$router.push('/SystemCenter/Upgradation')
    },

    // 发送验证码
    sendCode() {
      // 页面触发发送验证码功能
      this.$refs['EditPhoneDialogRef'].validateField('phone', (valid) => {
        if (!valid) {
          if (this.EditPhoneDialog.btnOptFlag) return
          this.EditPhoneDialog.btnOptFlag = true//禁用发送验证码按钮
          this.EditPhoneDialog.codeBtnText = this.EditPhoneDialog.outTime + 's后重新发送'
          if (!this.EditPhoneDialog.timer) {
            this.EditPhoneDialog.timer = setInterval(() => {
              this.EditPhoneDialog.codeBtnText = this.EditPhoneDialog.outTime - 1 + 's后重新发送'
              this.EditPhoneDialog.outTime = this.EditPhoneDialog.outTime - 1
              if (this.EditPhoneDialog.outTime < 0) {//倒计时结束，重置时间器
                clearInterval(this.EditPhoneDialog.timer)
                this.EditPhoneDialog.codeBtnText = '获取验证码'
                this.EditPhoneDialog.outTime = 60
                this.EditPhoneDialog.timer = null
                this.EditPhoneDialog.btnOptFlag = false
              }
            }, 1000)//每秒执行一次
          }
        }
      });
    },
    // 修改手机号 点击确定按钮
    submitEditPhone(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.submitLoading = false;
            this.EditPhoneDialog.visible = false;
            this.$message.success('修改成功')
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 修改手机号 关闭
    closeEditPhoneDialog() {
      this.$refs['EditPhoneDialogRef'].resetFields();
    },

    //更改推送地址弹框 点击确定按钮 
    submitChangeAddress(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            this.submitLoading = false;
            this.ChangeAddressDialog.visible = false;
            this.$message.success('操作成功')
          }, 500);
        } else {
          return false;
        }
      });
    },
    // 更改推送地址弹框 关闭
    closeChangeAddressDialog() {
      this.$refs['ChangeAddressDialogRef'].resetFields();
    }
  }
}
</script>

<style scoped lang="scss">
.card_wrap {
  margin-top: 15px;
  .head {
    font-size: 16px;
  }
  .cont {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}

.sendCode_wrap {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  div {
    &:nth-child(1) {
      flex: 1;
    }
  }
}
</style>