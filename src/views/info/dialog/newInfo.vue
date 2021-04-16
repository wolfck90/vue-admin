<template>
  <div>
    <el-dialog title="新增" :visible.sync="infoDialog" @close="close" @open="opened" width="580px">
      <el-form :model="form" ref="infoForm">
        <el-form-item label="类别：" :label-width="formLabelWidth" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option
              v-for="item in categoryInfoList.item"
              :key="item.id"
              :label="item.category_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题：" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title" autocomplete="off" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="概况：" :label-width="formLabelWidth" prop="content">
          <el-input type="textarea" v-model="form.content" autocomplete="off" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="danger" :loading="submitLoading" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch } from '@vue/composition-api'
import { AddInfo } from '@/api/news'
export default {
  name: 'newInfo',
  props: {
    infoVisible: {
      type: Boolean,
      default: false
    },
    categoryInfo: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit, root, refs }) {
    // 基础数据
    const infoDialog = ref(false)
    const formLabelWidth = ref('70px')
    const submitLoading = ref(false)

    // 对象数据
    const form = reactive({
      category: '',
      title: '',
      content: ''
    })
    // 从父组件接收过来的分类数据
    const categoryInfoList = reactive({
      item: []
    })
    // 方法
    const close = () => {
      infoDialog.value = false
      emit('update:infoVisible', false)
      resetFrom()
      // 刷新页面
      emit('getListEmit')
    }
    // 打开对话框时触发
    const opened = () => {
      categoryInfoList.item = props.categoryInfo
    }
    // 关闭时清空内容
    const resetFrom = () => {
      refs.infoForm.resetFields()
      // form.category = ''
      // form.title = ''
      // form.content = ''
    }
    // 点击确定提交内容
    const submit = () => {
      console.log(111)
      // 判断内容是否为空
      if (!form.category) {
        root.$message({
          message: '分类信息不能为空',
          type: 'error'
        })
        return false
      }
      if (!form.title) {
        root.$message({
          message: '标题不能为空',
          type: 'error'
        })
        return false
      }
      const requestData = {
        categoryId: form.category,
        title: form.title,
        content: form.content
      }
      submitLoading.value = true
      AddInfo(requestData)
        .then(response => {
          root.$message({
            message: response.data.message,
            type: 'success'
          })
          submitLoading.value = false
          // 提交后清空内容
          // resetFrom()
          close()
        })
        .catch(
          submitLoading.value = false
        )
    }
    watch(() => props.infoVisible, () => (infoDialog.value = props.infoVisible))
    return {
      // ref
      infoDialog,
      formLabelWidth,
      submitLoading,
      // reactive
      form,
      categoryInfoList,
      // methods
      close,
      opened,
      submit
    }
  }
}
</script>

<style lang="scss" scoped></style>
