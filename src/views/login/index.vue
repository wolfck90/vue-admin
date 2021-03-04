<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li :class="{ current: item.current }" v-for="item in menuTab" :key="item.id" @click="toggleMenu(item)">
          {{ item.txt }}
        </li>
      </ul>
      <!-- 表单开始 -->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form">
        <el-form-item prop="email" class="item-form">
          <label for="email">邮箱</label>
          <el-input type="text" id="email" v-model="ruleForm.email" autocomplete="off" size="medium"></el-input>
        </el-form-item>

        <el-form-item prop="passWord" class="item-form">
          <label for="password">密码</label>
          <el-input
            type="password"
            id="password"
            v-model="ruleForm.passWord"
            autocomplete="off"
            size="medium"
            minlength="6"
            maxlength="20"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="passWords" class="item-form" v-show="model === 'register'">
          <label for="checkPass">重复密码</label>
          <el-input
            type="password"
            id="checkPass"
            v-model="ruleForm.passWords"
            autocomplete="off"
            size="medium"
            minlength="6"
            maxlength="20"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <el-input v-model="ruleForm.code" id="code" minlength="6" maxlength="6"></el-input
            ></el-col>
            <el-col :span="9">
              <el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{
                codeButtonStatus.text
              }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            size="medium"
            :disabled="buttonStatus"
            >{{ model === 'login' ? '登录' : '注册' }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入加密 sha1
import sha1 from 'js-sha1'
// 导入api
import { GetSms, Register } from '@/api/login.js'
// 导入composition-api
import { reactive, ref } from '@vue/composition-api'
// 导入工具函数，验证相关
import { stripscript, validateEmails, validatePass, validateCode } from '@/utils/validate'
export default {
  name: 'login',
  setup(props, { refs, root }) {
    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (validateEmails(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validatePassWord = (rule, value, callback) => {
      // 过滤特殊符号
      ruleForm.passWord = stripscript(value)
      value = ruleForm.passWord
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
    const validatePassWords = (rule, value, callback) => {
      // 如果当前模式为登录，则没有重复密码验证，避免出现bug
      if (model.value === 'login') {
        callback()
      }
      // 过滤特殊符号
      ruleForm.passWords = stripscript(value)
      value = ruleForm.passWords
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (ruleForm.passWord !== value) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    // 验证验证码
    const checkCode = (rule, value, callback) => {
      // const reg = /^[a-z0-9]{6}$/
      if (value === '') {
        return callback(new Error('验证码为空'))
      } else if (validateCode(value)) {
        callback(new Error('验证码有误！'))
      } else {
        callback()
      }
    }

    /* **************************************************************************************************** */
    // 声明数据
    // 声明对象数据类型用reactive
    const menuTab = reactive([
      { txt: '登录', current: true, type: 'login' },
      { txt: '注册', current: false, type: 'register' }
    ])
    // 声明普通数据类型用ref
    const model = ref('login')
    // 登录按钮状态
    const buttonStatus = ref(true)
    // 倒计时时间
    const timer = ref(null)
    // 获取验证码状态
    const codeButtonStatus = reactive({
      status: false,
      text: '获取验证码'
    })

    const ruleForm = reactive({
      email: '',
      passWord: '',
      passWords: '',
      code: ''
    })

    // 表单验证
    const rules = reactive({
      email: [{ validator: validateEmail, trigger: 'blur' }],
      passWord: [{ validator: validatePassWord, trigger: 'blur' }],
      passWords: [{ validator: validatePassWords, trigger: 'blur' }],
      code: [{ validator: checkCode, trigger: 'blur' }]
    })

    /* ********************************************************************** */
    // 声明函数
    // 切换登录和注册
    const toggleMenu = data => {
      // 做切换的时候，先保证能出现一个点击一个未点击的效果，然后做点击事件，点击后保证两个都有效果，最后在每次点击前清除所有的点击效果
      menuTab.forEach(v => {
        v.current = false
      })
      // 高光
      data.current = true
      // 将模式切换
      model.value = data.type
      // 将表单信息清空
      restForm()
      // 清除定时器
      clearCountDown()
    }
    // 重置表单信息
    const restForm = () => {
      refs.loginForm.resetFields()
    }
    // 更新按钮状态
    const updataButtonStatus = params => {
      codeButtonStatus.status = params.status
      codeButtonStatus.text = params.text
    }
    // 倒计时
    const countDown = number => {
      // 开启定时器之前先判断定时器是否存在，如果存在就先清除
      if (timer.value) {
        clearInterval(timer.value)
      }
      let time = number
      timer.value = setInterval(() => {
        time--
        if (time === 0) {
          // 清除定时器
          clearInterval(timer.value)
          updataButtonStatus({
            status: false,
            text: '重新发送'
          })
        } else {
          codeButtonStatus.status = true
          codeButtonStatus.text = `倒计时${time}秒`
        }
      }, 1000)
    }
    // 清除倒计时
    const clearCountDown = () => {
      clearInterval(timer.value)
      updataButtonStatus({
        status: false,
        text: '获取验证码'
      })
    }
    // 获取验证码
    const getSms = () => {
      // 点击按钮，发送请求前先验证邮箱时候为空，格式是否正确
      if (ruleForm.email === '') {
        root.$message.error('邮箱不能为空！！')
        // root.$message.error('邮箱不能为空！！')
        return false
      }
      // 验证邮箱格式，如果不正确，阻止发送请求
      if (validateEmails(ruleForm.email)) {
        root.$message.error('邮箱格式有误，请重新输入')
        return false
      }

      const data = {
        username: ruleForm.email,
        module: model.value
      }
      // 禁用验证码按钮
      // codeButtonStatus.status = true
      updataButtonStatus({
        status: true,
        text: '发送中'
      })
      // 延时发送
      GetSms(data)
        .then(response => {
          const requestData = response.data
          // 用message将后台返回的信息显示在前台
          root.$message({
            message: requestData.message,
            type: 'success'
          })
          // 启用登录/注册按钮
          buttonStatus.value = false
          // 倒计时60s
          countDown(60)
        })
        .catch(error => {
          // 启用登录或注册按钮
          buttonStatus.value = false
          updataButtonStatus({
            status: false,
            text: '再次获取'
          })
          console.log(error)
        })
    }
    // 登录或者注册
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          // 调接口，发送请求
          model.value === 'login' ? login() : register()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    // 登录
    const login = () => {
      const requestData = {
        username: ruleForm.email,
        passWord: sha1(ruleForm.passWord),
        code: ruleForm.code
      }
      root.$store
        .dispatch('app/login', requestData)
        .then(response => {
          const data = response.data
          root.$message({
            message: data.message,
            type: 'success'
          })
          // 通过路由跳转到console页面
          root.$router.push({ name: 'Console' })
        })
        .catch(error => {
          console.log(error)
        })
    }

    // 注册
    const register = () => {
      const requestdata = {
        username: ruleForm.email,
        passWord: sha1(ruleForm.passWord),
        code: ruleForm.code,
        modules: 'register'
      }

      Register(requestdata)
        .then(response => {
          const data = response.data
          root.$message({
            message: data.message,
            type: 'success'
          })
          // 注册成功后切换到登录页面
          toggleMenu(menuTab[0])
          clearCountDown()
        })
        .catch(error => {
          console.log(error)
        })
    }

    //
    // 最后将声明完的都返回出去
    return {
      menuTab,
      model,
      buttonStatus,
      codeButtonStatus,
      timer,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      countDown,
      getSms
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
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
