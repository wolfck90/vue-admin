<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" class="demo-ruleForm">
      <el-form-item label="信息分类：" prop="name">
        <el-select v-model="form.categoryId" placeholder="请选择分类">
          <el-option
            :label="item.category_name"
            v-for="item in data.category"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新闻标题：">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="缩略图：">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
        >
          <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="发布日期：">
        <el-date-picker v-model="form.createDate" type="datetime" placeholder="选择日期时间" disabled> </el-date-picker>
      </el-form-item>
      <el-form-item label="详细内容:">
        <quillEditor v-model="form.content" ref="myQuillEditor" :options="data.editorOption"></quillEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="data.submitLoading">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { onMounted, reactive } from '@vue/composition-api'
import { GetList, EditInfo } from '@/api/news'
import { timestampToTime } from '@/utils/common'
// 引入富文本编辑器 vue-quill-editor
import { quillEditor } from 'vue-quill-editor'
import { QiniuToken } from '@/api/common'
// 引入富文本编辑样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: 'Infodetailed',
  components: { quillEditor },
  setup(props, { root }) {
    const form = reactive({
      categoryId: '',
      title: '',
      createDate: '',
      content: '',
      imgUrl: ''
    })
    // 使用getters的时候，如果有命名空间，需要使用getters['xxx'],不能使用getters.xxx
    // const id = root.$route.params.id || root.$store.getters['infoDetail/infoId']
    const data = reactive({
      id: root.$route.params.id || root.$store.getters['infoDetail/infoId'],
      category: [],
      editorOption: {},
      submitLoading: false,
      uploadKey: {
        token: '',
        key: ''
      }
    })

    // 获取分类数据
    const getCategoryInfo = () => {
      root.$store.dispatch('common/getCategory').then(response => {
        data.category = response
      })
    }
    // 点击编辑详情后，将当前数据带过来
    const getInfo = () => {
      const requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id
      }
      GetList(requestData).then(response => {
        const responseData = response.data.data.data[0]
        form.categoryId = responseData.categoryId
        form.title = responseData.title
        // 时间要格式化一下
        form.createDate = timestampToTime(responseData.createDate)
        form.content = responseData.content
      })
    }
    // 保存数据
    const submit = () => {
      const requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: ''
      }
      data.submitLoading = true
      EditInfo(requestData)
        .then(response => {
          root.$message({
            message: response.data.message,
            type: 'success'
          })
          data.submitLoading = false
          // 跳转回到信息列表页面
          root.$router.push('InfoIndex')
        })
        .catch((data.submitLoading = false))
    }
    // 获取七牛云token
    const getQiniuToken = () => {
      const responseData = {
        accesskey: 'PiJeuMlXSusMo7Q2PcfZYy71_m0fqWmrvvYZNwq3',
        secretkey: 'qp9XV4wvJrjwglQ0nVlfWTEdzc3erh0xeP1FBPqE',
        buckety: 'miracle-muran'
      }
      QiniuToken(responseData)
        .then(response => {
          // 存储token
          data.uploadKey.token = response.data.data
          console.log(data.uploadKey.token)
        })
        .catch()
    }
    const handleImageSuccess = (res, file) => {
      // form.imgUrl = `http://qq1wwgos9.hn-bkt.clouddn.com/${res.key}`
      form.imgUrl = URL.createObjectURL(file.raw)
    }
    const beforeImageUpload = file => {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        root.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        root.$message.error('上传头像图片大小不能超过 2MB!')
      }

      // 文件转码
      const suffix = file.name
      const key = encodeURI(`${suffix}`)
      data.uploadKey.key = key
      return isJPG && isLt2M
    }
    onMounted(() => {
      getCategoryInfo()
      getInfo()
      getQiniuToken()
    })
    return {
      data,
      form,
      submit,
      getQiniuToken,
      beforeImageUpload,
      handleImageSuccess
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
