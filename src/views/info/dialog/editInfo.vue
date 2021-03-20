<template>
  <div>
    <el-dialog title="新增" :visible.sync="editDialog" @close="close" @open="opened" width="580px">
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
import { EditInfo, GetList } from '@/api/news'
export default {
  name: 'newInfo',
  props: {
    editInfoVisible: {
      type: Boolean,
      default: false
    },
    categoryInfo: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit, root, refs }) {
    // 基础数据
    const editDialog = ref(false)
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
      editDialog.value = false
      emit('changeFlag')
      resetFrom()
      // 刷新页面
      emit('getListEmit')
    }
    // 打开对话框时触发
    const opened = () => {
      categoryInfoList.item = props.categoryInfo
      // 将已有的数据填到表单中
      getInfo()
    }
    const getInfo = () => {
      const requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: props.id
      }
      GetList(requestData).then(response => {
        const responseData = response.data.data.data[0]
        form.category = responseData.categoryId
        form.title = responseData.title
        form.content = responseData.content
      })
    }
    // 关闭时清空内容
    const resetFrom = () => {
      refs.infoForm.resetFields()
      // form.id = ''
      // form.category = ''
      // form.title = ''
      // form.content = ''
    }
    // 点击确定提交内容
    const submit = () => {
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
        id: props.id,
        categoryId: form.category,
        title: form.title,
        content: form.content
      }
      submitLoading.value = true
      EditInfo(requestData)
        .then(response => {
          root.$message({
            message: response.data.message,
            type: 'success'
          })
          submitLoading.value = false
          // 提交后清空内容
          resetFrom()
          close()
        })
        .catch(
          submitLoading.value = false
        )
    }
    watch(() => props.editInfoVisible, () => (editDialog.value = props.editInfoVisible))
    return {
      // ref
      editDialog,
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
