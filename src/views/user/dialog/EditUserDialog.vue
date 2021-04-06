<template>
  <div>
    <el-dialog title="编辑" :visible.sync="EditUserDialog" @close="close" @open="opened" width="580px">
      <el-form :model="data.form" :rules="rules" ref="userForm">
        <el-form-item label="用户名：" :label-width="formLabelWidth" prop="username">
          <el-input v-model="data.form.username" autocomplete="off" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth" prop="password">
          <el-input v-model="data.form.password" type="password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" :label-width="formLabelWidth" prop="truename">
          <el-input v-model="data.form.truename" autocomplete="off" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="手机：" :label-width="formLabelWidth" prop="phone">
          <el-input v-model.number="data.form.phone" autocomplete="off" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="地区：" :label-width="formLabelWidth" prop="region">
          <CityPick ref="" :cityPickerData.sync="data.cityPickerData"></CityPick>
        </el-form-item>
        <el-form-item label="是否启用：" :label-width="formLabelWidth" prop="status">
          <el-radio v-model="data.form.status" label="1">禁用</el-radio>
          <el-radio v-model="data.form.status" label="2">启用</el-radio>
        </el-form-item>
        <el-form-item label="系统：" :label-width="formLabelWidth" prop="role">
          <el-checkbox-group v-model="data.form.role">
            <el-checkbox v-for="item in data.roleItem" :key="item.role" :label="item.role">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger" :loading="submitLoading" @click="submit('userForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sha1 from 'js-sha1'
import { reactive, ref, watch } from '@vue/composition-api'
import CityPick from '@c/CityPick'
import { validateEmails, validatePass, stripscript, validateTrueNames, validatePhones } from '@/utils/validate'
import { GetRoles, GetSystem, EditUser } from '@/api/user'
export default {
  name: 'EditUserDialog',
  components: { CityPick },
  props: {
    dialog_edit: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit, root, refs }) {
    // 验证用户名
    const validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (validateEmails(value)) {
        callback(new Error('邮箱格式有误'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validatePassWord = (rule, value, callback) => {
      /*
       * 验证逻辑： 1.编辑选项
        需要验证密码  data.form.id 存在且密码不为空的时候
        不用验证密码 data.form.id 存在，密码为空的时候
        2.添加的时候
        data.form.id 不存在的时候需要验证密码
       *
      */
      // 不用验证密码时
      if (data.form.id && !value) {
        callback()
      }
      // 需要验证密码
      if ((data.form.id && value) || !data.form.id) {
        // 过滤特殊符号
        if (value) {
          data.form.passWord = stripscript(value)
          value = data.form.passWord
        }
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (validatePass(value)) {
          callback(new Error('密码格式有误！请输入6-20位的字母+数字'))
        } else {
          callback()
        }
      }
    }
    // 验证中文名
    const validateTrueName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('真实姓名不能为空'))
      } else if (validateTrueNames(value)) {
        callback(new Error('姓名格式有误'))
      } else {
        callback()
      }
    }
    // 验证手机
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (validatePhones(value)) {
        callback(new Error('手机格式不正确'))
      } else {
        callback()
      }
    }
    // 基础数据
    const EditUserDialog = ref(false)
    const formLabelWidth = ref('90px')
    const submitLoading = ref(false)
    // 对象数据

    const data = reactive({
      cityPickerData: {},
      form: {
        username: '',
        truename: '',
        password: '',
        phone: '',
        // 禁用启用
        status: '2',
        // 角色
        role: []
      },
      // 角色选择
      roleItem: []
    })

    // 表单验证
    const rules = reactive({
      username: [{ validator: validateUserName, trigger: 'blur' }],
      password: [{ validator: validatePassWord, trigger: 'blur' }],
      truename: [{ validator: validateTrueName, trigger: 'blur' }],
      phone: [{ validator: validatePhone, trigger: 'blur' }],
      role: [{ required: true, message: '请选择角色', trigger: 'change' }]
    })

    // 方法

    const close = () => {
      EditUserDialog.value = false
      emit('update:dialog_edit', false)
      resetFrom()
    }

    // 获取角色
    const getRole = () => {
      if (data.roleItem.length === 0) {
        GetRoles().then(response => {
          data.roleItem = response.data.data
        })
      }
    }
    // 打开对话框时触发
    const opened = () => {
      getRole()
      // 打开对话框的时候，将数据填到表里
      const editData = props.editData
      console.log(editData)
      editData.role = editData.role.split(',')
      data.form = editData
      console.log(editData)
    }

    // 关闭时清空内容
    const resetFrom = () => {
      data.cityPickerData = {}
      refs.userForm.resetFields()
    }
    // 点击确定提交内容
    const submit = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          const requestData = Object.assign({}, data.form)
          // 将role数组转成字符串，然后在赋值到requestData中
          requestData.role = requestData.role.join()
          // 密码加密
          requestData.region = JSON.stringify(data.cityPickerData)
          // 判断：如果存在id，则是编辑，如果有密码，则将密码加密，否则删除密码
          // 如果没有id，这是新增，需要对密码加密
          if (requestData.password) {
            requestData.password = sha1(requestData.password)
          } else {
            delete requestData.password
          }
          userEdit(requestData)
        } else {
          return false
        }
      })
    }
    // const userAdd = requestData => {
    //   // 发送请求
    //   AddUser(requestData).then(response => {
    //     console.log(response.data.data)
    //     root.$message({
    //       message: '添加成功',
    //       type: 'success'
    //     })
    //     // 清空表单
    //     close()
    //     // 刷新页面
    //     emit('refreshTableData')
    //   })
    // }

    const userEdit = requestData => {
      EditUser(requestData).then(response => {
        console.log(response.data.data)
        root.$message({
          message: '添加成功',
          type: 'success'
        })
        // 清空表单
        close()
        // 刷新页面
        emit('refreshTableData')
      })
    }
    watch(
      () => props.dialog_edit,
      () => (EditUserDialog.value = props.dialog_edit)
    )
    return {
      // ref
      EditUserDialog,
      formLabelWidth,
      submitLoading,
      // reactive
      data,
      rules,
      // methods
      close,
      opened,
      submit
    }
  }
}
</script>

<style lang="scss" scoped></style>
