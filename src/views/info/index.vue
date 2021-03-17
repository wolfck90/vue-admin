<template>
  <div>
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for="">分类：</label>
          <div class="label-content">
            <el-select v-model="category_value" placeholder="请选择">
              <el-option
                v-for="item in options.categoryOptions"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="label-wrap date">
          <label for="">日期：&nbsp;&nbsp;</label>
          <div class="label-content">
            <el-date-picker
              style="width: 100%"
              v-model="date_value"
              type="datetimerange"
              align="right"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="label-wrap key_word">
          <label for="">关键字：&nbsp;&nbsp;</label>
          <div class="label-content">
            <el-select v-model="search_key" style="width:100%">
              <el-option v-for="item in search_option" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input v-model="search_word" placeholder="请输入内容" style="width:100%"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" style="width:100%" @click="getList()">搜索</el-button>
      </el-col>
      <!-- 这里不用:offset的原因是优先级不够 -->
      <el-col :span="2" style="margin-left: 12.5%">
        <el-button type="danger" class="pull-right" style="width:100%" @click="newInfo()">新增</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <!-- 表格区域 -->
    <el-table
      :data="tableData.item"
      border
      style="width: 100%"
      v-loading="loadingData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column prop="title" label="标题" width="750"> </el-table-column>
      <el-table-column prop="categoryId" label="分类" width="130" :formatter="formatterCate"> </el-table-column>
      <el-table-column prop="createDate" label="日期" :formatter="formatterTime" width="237"> </el-table-column>
      <el-table-column prop="user" label="管理员" width="115"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteInfo(scope.row.id)">删除</el-button>
          <el-button size="mini" type="success" @click="editInfo(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="success" @click="detailed(scope.row)">编辑详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="black-space-30"></div>
    <!-- 底部区域 -->
    <el-row>
      <el-col :span="12">
        <el-button size="medium" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[2, 4, 5, 10]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageData.total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增信息对话框组件 -->
    <newInfoDialog :infoVisible.sync="infoDialog" :categoryInfo="options.categoryOptions" @getListEmit="getList" />
    <!-- 编辑信息对话框组件 -->
    <editInfoDialog
      :editInfoVisible.sync="editDialog"
      :id="infoId"
      :categoryInfo="options.categoryOptions"
      @changeFlag="changeFlag"
      @getListEmit="getList"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from '@vue/composition-api'
import newInfoDialog from './dialog/newInfo'
import editInfoDialog from './dialog/editInfo'
import { global } from '@/utils/global.js'
import { GetList, DeleteInfo } from '@/api/news'
import { timestampToTime } from '@/utils/common'
export default {
  name: 'infoIndex',
  components: { newInfoDialog, editInfoDialog },
  setup(props, { root }) {
    // 这里注意将confirm解构出来
    const { confirm } = global()
    // ref
    const category_value = ref('')
    const date_value = ref('')
    const search_key = ref('id')
    const search_word = ref('')
    const infoDialog = ref(false)
    const editDialog = ref(false)
    const loadingData = ref(true)
    // 需要删除数据的id
    const deleteInfoId = ref('')
    const infoId = ref('')
    // reactive
    const options = reactive({
      categoryOptions: []
    })

    const search_option = reactive([
      { value: 'id', label: 'ID' },
      { value: 'title', label: '标题' }
    ])
    // 列表数据
    const tableData = reactive({
      item: []
    })
    // 页码数据
    const pageData = reactive({
      pageSize: 5,
      pageNumber: 1,
      total: 0
    })

    // methods
    const editInfo = id => {
      editDialog.value = true
      infoId.value = id
    }
    const changeFlag = () => {
      editDialog.value = false
    }
    const deleteInfo = id => {
      // 将id保存到数据中
      deleteInfoId.value = [id]
      confirm({
        content: '确认删除内容，是否继续',
        fn: confirmDelete
      })
    }
    const deleteAll = () => {
      // 判断是否勾选了想要删除的数据
      if (!deleteInfoId.value || deleteInfoId.value.length === 0) {
        root.$message({
          message: '请选择需要删除的数据',
          type: 'warning'
        })
        return false
      }
      confirm({
        content: '确认删除全部已选中内容，是否继续',
        tip: '警告',
        fn: confirmDelete
      })
    }
    const confirmDelete = () => {
      DeleteInfo({ id: deleteInfoId.value })
        .then(response => {
          console.log(response)
          root.$message({
            message: response.data.message,
            type: 'success'
          })
          deleteInfoId.value = ''
          getList()
        })
        .catch(error => {
          console.log(error)
        })
    }
    const newInfo = () => {
      infoDialog.value = true
    }
    //  获取分类数据
    const getCategoryInfo = () => {
      root.$store.dispatch('common/getCategory').then(response => {
        options.categoryOptions = response
      })
    }
    const formatData = () => {
      const requestData = {
        pageNumber: pageData.pageNumber,
        pageSize: pageData.pageSize
      }
      if (category_value.value) {
        requestData.categoryId = category_value.value
      }
      if (date_value || date_value.value.length > 0) {
        requestData.startTiem = date_value.value[0]
        requestData.endTiem = date_value.value[1]
      }
      if (search_word) {
        requestData[search_key.value] = search_word.value
      }
      return requestData
    }
    // 获取列表信息
    const getList = () => {
      const requestData = formatData()
      loadingData.value = true
      GetList(requestData)
        .then(response => {
          const data = response.data.data
          tableData.item = data.data
          // 将页码总数赋值给total
          pageData.total = data.total
          loadingData.value = false
        })
        .catch((loadingData.value = false))
      // root.$store
      //   .dispatch('common/getList', requestData)
      //   .then(response => {
      //     console.log(response)
      //     tableData.item = response.data
      //     // 将页码总数赋值给total
      //     pageData.total = response.total
      //     loadingData.value = false
      //   })
      //   .catch((loadingData.value = false))
    }
    // 修改每页数量
    const handleSizeChange = val => {
      pageData.pageSize = val
    }
    // 修改当前页码
    const handleCurrentChange = val => {
      pageData.pageNumber = val
      getList()
    }
    //  格式化时间戳
    const formatterTime = row => {
      return timestampToTime(row.createDate)
    }
    // 格式化分类
    const formatterCate = row => {
      const categoryId = row.categoryId
      // console.log(categoryId)
      // 过滤，如果categoryId == options.categoryOptions.id,那就将category_name返回出去
      const categoryData = options.categoryOptions.filter(item => item.id === categoryId)[0]
      // console.log(categoryData)
      if (!categoryData) {
        return false
      }
      return categoryData.category_name
    }
    const handleSelectionChange = val => {
      // 将id取出来放到deleteInfoId中
      const id = val.map(item => item.id)
      deleteInfoId.value = id
    }
    // 点击跳转到详细信息页面
    const detailed = (data) => {
      // 跳转页面前先将数据存储在vuex中
      root.$store.commit('infoDetail/set_id', data.id)
      root.$store.commit('infoDetail/set_title', data.title)
      // 跳转页面，把参数也带过去
      root.$router.push({
        name: 'InfoDetail',
        params: {
          id: data.id,
          title: data.title
        }
      })
    }

    onMounted(() => {
      // 获取分类信息
      getCategoryInfo()
      // 获取列表信息
      getList()
    })

    return {
      // ref
      category_value,
      date_value,
      search_key,
      search_word,
      loadingData,
      deleteInfoId,
      editDialog,
      infoId,
      // reactive
      options,
      search_option,
      tableData,
      pageData,
      // methods
      editInfo,
      deleteInfo,
      infoDialog,
      newInfo,
      deleteAll,
      confirmDelete,
      getCategoryInfo,
      getList,
      handleSizeChange,
      handleCurrentChange,
      formatterTime,
      formatterCate,
      handleSelectionChange,
      changeFlag,
      formatData,
      detailed
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/config';
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 93, 40);
  }
  &.key_word {
    @include labelDom(right, 99, 40);
  }
}
</style>
