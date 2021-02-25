<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: item.current }"
          v-for="item in menuTab"
          :key="item.id"
          @click="toggle(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!-- 表单开始 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
      >
        <el-form-item prop="email" class="item-form">
          <label for="">邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.email"
            autocomplete="off"
            size="medium"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passWord" class="item-form">
          <label for="">密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passWord"
            autocomplete="off"
            size="medium"
            minlength="6"
            maxlength="20"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="passWords"
          class="item-form"
          v-show="model === 'register'"
        >
          <label for="">重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passWords"
            autocomplete="off"
            size="medium"
            minlength="6"
            maxlength="20"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for="">验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <el-input
                v-model.number="ruleForm.code"
                size="medium"
                minlength="6"
                maxlength="6"
              ></el-input
            ></el-col>
            <el-col :span="9"
              ><el-button type="success" size="medium"
                >获取验证码</el-button
              ></el-col
            >
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="login-btn block"
            size="medium"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入工具函数，验证相关
import {
  stripscript,
  validateEmails,
  validatePass,
  validateCode
} from '@/ulits/validate'
export default {
  data() {
    // 验证邮箱
    var validateEamil = (rule, value, callback) => {
      // const reg = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (validateEmails(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    // 验证密码
    var validatePassWord = (rule, value, callback) => {
      // 过滤特殊符号
      this.ruleForm.passWord = stripscript(value)
      value = this.ruleForm.passWord
      // const reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (validatePass(value)) {
        callback(new Error('密码格式有误！'))
      } else {
        callback()
      }
    }
    // 验证重复密码
    var validatePassWords = (rule, value, callback) => {
      // 如果当前模式为登录，则没有重复密码验证，避免出现bug
      if (this.model === 'login') {
        callback()
      }
      // 过滤特殊符号
      this.ruleForm.passWords = stripscript(value)
      value = this.ruleForm.passWords
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (this.ruleForm.passWord !== value) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    // 验证验证码
    var checkCode = (rule, value, callback) => {
      // const reg = /^[a-z0-9]{6}$/
      if (value === '') {
        return callback(new Error('验证码为空'))
      } else if (validateCode(value)) {
        callback(new Error('验证码有误！'))
      } else {
        callback()
      }
    }
    return {
      menuTab: [
        { txt: '登录', current: true, type: 'login' },
        { txt: '注册', current: false, type: 'register' }
      ],
      // 当前模式
      model: 'login',
      ruleForm: {
        email: '',
        passWord: '',
        passWords: '',
        code: ''
      },
      rules: {
        email: [{ validator: validateEamil, trigger: 'blur' }],
        passWord: [{ validator: validatePassWord, trigger: 'blur' }],
        passWords: [{ validator: validatePassWords, trigger: 'blur' }],
        code: [{ validator: checkCode, trigger: 'blur' }]
      }
    }
  },
  methods: {
    toggle(data) {
      // 做切换的时候，先保证能出现一个点击一个未点击的效果，然后做点击事件，点击后保证两个都有效果，最后在每次点击前清除所有的点击效果
      this.menuTab.forEach(v => {
        v.current = false
      })
      data.current = true
      // 将模式切换
      this.model = data.type
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  background-color: #344a5f;
  height: 100vh;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    margin-bottom: 3px;
    display: block;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    width: 100%;
    display: block;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
