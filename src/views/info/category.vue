<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({ type: 'Category_first_add' })">添加一级分类</el-button>
    <hr />
    <el-row :gutter="40">
      <el-col :span="8">
        <div class="category-wrap">
          <div class="category" v-for="categoryItem in categoryForm.item" :key="categoryItem.id">
            <h4>
              <svg-icon iconClass="open"></svg-icon>
              {{ categoryItem.category_name }}
              <div class="button-group">
                <el-button
                  size="mini"
                  type="danger"
                  @click="editCategory({ data: categoryItem, type: 'Category_first_edit' })"
                  round
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="success"
                  round
                  @click="addChildrenItem({ data: categoryItem, type: 'Category_children_add' })"
                  >添加子级</el-button
                >
                <el-button size="mini" round @click="deleteCategoryConfirm(categoryItem.id)">删除</el-button>
              </div>
            </h4>
            <ul v-if="categoryItem.children">
              <li v-for="childrenItem in categoryItem.children" :key="childrenItem.id">
                {{ childrenItem.category_name }}
                <div class="button-group">
                  <el-button size="mini" type="danger" round>编辑</el-button>
                  <el-button size="mini" round>删除</el-button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <h4 class="menu-title">一级分类编辑</h4>
        <el-form :label-position="labelPosition" label-width="142px" ref="catrgoryForm" class="form-wrap">
          <el-form-item label="一级分类名称：" v-if="category_first_input">
            <el-input v-model="form.categoryName" :disabled="category_first_disable"></el-input>
          </el-form-item>
          <el-form-item label="二级分类名称：" v-if="category_children_input">
            <el-input v-model="form.secCategoryName" :disabled="category_children_disable"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="submit" :disabled="submit_button_disable" :loading="button_loading"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { AddFirstCategory, DeleteCategory, EditFirstCategory, AddChildrenCategory } from '@/api/news'
import { global } from '@/utils/global'
import { common } from '@/api/common'
import { reactive, ref, onMounted, watch } from '@vue/composition-api'
export default {
  name: 'category',
  setup(props, { root, refs }) {
    // 引入确认删除组件
    const { confirm } = global()
    const { getCategoryAll, categoryData } = common()
    // console.log(categoryData.item)
    // ref
    const labelPosition = ref('right')
    const category_first_input = ref(true)
    const category_children_input = ref(true)
    const category_first_disable = ref(true)
    const category_children_disable = ref(true)
    const submit_button_disable = ref(true)
    const button_loading = ref(false)
    const confirmDeleteId = ref('')
    const submit_button_type = ref('')
    // reactive
    const form = reactive({
      categoryName: '',
      secCategoryName: '',
      type: ''
    })
    const categoryForm = reactive({
      item: [],
      current: []
    })
    // methods
    const submit = () => {
      if (submit_button_type.value === 'Category_first_add') {
        addFirstCategory()
      }
      if (submit_button_type.value === 'Category_first_edit') {
        editFirstCategory()
      }
      if (submit_button_type.value === 'Category_children_add') {
        addChildrenCategory()
      }
    }
    // 添加一级分类
    const addFirstCategory = () => {
      if (!form.categoryName) {
        root.$message.error('分类名称不能为空')
        return false
      }
      // 修改按钮状态
      button_loading.value = true
      AddFirstCategory({ categoryName: form.categoryName })
        .then(response => {
          const data = response.data
          // console.log(data)
          if (data.resCode === 0) {
            root.$message({
              message: data.message,
              type: 'success'
            })
            // 请求成功后可以选择，调接口重新渲染页面getCategoryAll()
            // getCategoryAll()
            // 也可以用push将数据加入到数组中
            categoryForm.item.push(data.data)
          }
          button_loading.value = false
          // 清空表单，element的方法失效，可能是个bug
          form.categoryName = ''
          form.secCategoryName = ''
        })
        .catch(error => {
          button_loading.value = false
          form.categoryName = ''
          form.secCategoryName = ''
          console.log(error)
        })
    }
    const restForm = () => {
      refs.categoryForm.resetFields()
    }
    const addFirst = params => {
      submit_button_type.value = params.type
      category_first_input.value = true
      category_children_input.value = false
      // 修改按钮状态
      category_first_disable.value = false
      submit_button_disable.value = false
    }
    // 添加二级分类
    const addChildrenItem = params => {
      submit_button_type.value = params.type
      // 存储数据
      categoryForm.current = params.data
      // 禁用一级分类
      category_first_disable.value = true
      // 启用确定按钮
      submit_button_disable.value = false
      // 启用二级分类
      category_children_disable.value = false
      // 显示二级分类
      category_children_input.value = true
      // 将一级分类数据显示在输入框内
      form.categoryName = params.data.category_name
    }
    const addChildrenCategory = () => {
      if (!form.secCategoryName) {
        root.$message({
          message: '子级分类名称不能为空',
          type: 'error'
        })
        return false
      }
      const requestData = {
        categoryName: form.secCategoryName,
        parentId: categoryForm.current.id
      }
      AddChildrenCategory(requestData).then(response => {
        const responseData = response.data.data
        root.$message({
          message: responseData.message,
          type: 'success'
        })
        // 添加成功后要清空输入框
        form.secCategoryName = ''
        // 刷新页面
        getCategoryAll()
      })
    }
    // 获取页面内容
    // const getCategoryAll = () => {
    //   GetCategoryAll()
    //     .then(response => {
    //       const data = response.data.data
    //       categoryForm.item = data
    //       console.log(categoryForm.item[0].children)
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // }
    // 删除一级分类
    const deleteCategoryConfirm = categoryId => {
      confirmDeleteId.value = categoryId
      // 点击后确认删除，确认后调接口删除
      confirm({
        content: '确认删除内容，是否继续',
        tip: '警告',
        fn: deleteCategory,
        catchFn: () => {
          // 取消删除的时候将id清空
          confirmDeleteId.value = ''
        }
      })
    }

    const deleteCategory = categoryId => {
      DeleteCategory({ categoryId: confirmDeleteId.value })
        .then(response => {
          // 删除成功后刷新页面
          // getCategoryAll()
          // 或者用数组方法splice删除，splice(起始索引，要删除的数量，要替换的数据)
          /*
            通过findIndex找到对应数据的index，然后在用splice删除
          */
          const index = categoryForm.item.findIndex(item => item.id === confirmDeleteId.value)
          categoryForm.item.splice(index, 1)
        })
        .catch(error => {
          console.log(error)
        })
    }

    // 编辑
    const editCategory = params => {
      submit_button_type.value = params.type
      // 解开一级分类输入框和确定按钮，隐藏二级分类
      category_first_disable.value = false
      submit_button_disable.value = false
      category_children_input.value = false
      // 将内容显示在输入框内
      form.categoryName = params.data.category_name
      // 将信息保存下来，方便后面使用
      categoryForm.current = params.data
      console.log(categoryForm.current)
    }

    const editFirstCategory = () => {
      // 判断输入框内容是否为空
      if (!form.categoryName) {
        root.$message({
          message: '内容不能为空',
          type: 'error'
        })
        return false
      }
      const responseData = {
        id: categoryForm.current.id,
        categoryName: form.categoryName
      }
      // 调用接口
      EditFirstCategory(responseData)
        .then(response => {
          console.log(response)
          const data = response.data
          root.$message({
            message: data.message,
            type: 'success'
          })
          // 将修改后的内容替换到页面上
          categoryForm.current.category_name = data.data.data.categoryName
          // 清空输入框内容和current
          form.categoryName = ''
          categoryForm.current = []
        })
        .catch(error => {
          console.log(error)
        })
    }

    // 生命周期
    onMounted(() => {
      getCategoryAll()
    })
    // 监听器 这个写法我看不懂
    watch(
      () => categoryData.item,
      value => {
        categoryForm.item = value
      }
    )
    return {
      // ref
      labelPosition,
      category_first_input,
      category_children_input,
      category_first_disable,
      category_children_disable,
      submit_button_disable,
      button_loading,
      confirmDeleteId,
      submit_button_type,
      // reactive
      form,
      categoryForm,
      // methods
      submit,
      addFirst,
      restForm,
      deleteCategoryConfirm,
      deleteCategory,
      addFirstCategory,
      editCategory,
      editFirstCategory,
      addChildrenItem
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/config';
ul,
li {
  list-style: none;
}
.category-wrap {
  div:first-child {
    &::after {
      top: 30px;
    }
  }
  div:last-child {
    &::after {
      bottom: 20px;
    }
  }
}
.menu-title {
  padding-left: 22px;
  line-height: 44px;
  background-color: #f3f3f3;
}
.category {
  position: relative;
  line-height: 44px;
  &::after {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    // width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
  }
  .button-group {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 12px;
  }
  li {
    position: relative;
    margin-left: 20px;
    padding-left: 40px;
    &::after {
      content: ' ';
      position: absolute;
      left: 0;
      top: 22px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  svg {
    position: absolute;
    left: 12px;
    top: 15px;
    font-size: 17px;
    background-color: #fff;
  }
  h4,
  li {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.form-wrap {
  width: 408px;
}
hr {
  margin: 30px -30px;
  background-color: #e9e9e9;
  height: 1px;
  border: none;
}
</style>
