<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label for="">关键字：</label>
          <div class="wrap-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <SelectVue :config="data.configOptions" :selectData.sync = "data.selectData"></SelectVue>
              </el-col>
              <el-col :span="5"><el-input v-model="data.keyWord" placeholder="请输入关键字"></el-input></el-col>
              <el-col :span="12"><el-button type="danger" size="medium" @click="search">搜索</el-button></el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right" size="medium" @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <!-- 表格 -->
    <TableVue ref="usertable" :configTable.sync="data.configTable" :tableRow.sync="data.tableRow">
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.data.status"
          @change="handerSwitch(slotData.data)"
          active-value="2"
          inactive-value="1"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button size="mini" type="danger" @click="delUser(slotData.data)">删除</el-button>
        <el-button size="mini" type="success" @click="editUser(slotData.data)">编辑</el-button>
      </template>
      <template v-slot:tableFooterLeft>
        <el-button size="mini" @click="handlerbtnAllDel">批量删除</el-button>
      </template>
    </TableVue>
    <!-- 新增用户对话框 -->
    <AddUserDialog :UserVisible.sync="data.UserDialog"  @refreshTableData="refreshData"></AddUserDialog>
    <EditUserDialog :dialog_edit.sync = 'data.dialog_edit'  :editData ='data.editData' @refreshTableData="refreshData"></EditUserDialog>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from '@vue/composition-api'
// 导入组件
import SelectVue from '@c/Select'
import TableVue from '@c/Table'
// import service from '@/utils/request.js'
import AddUserDialog from './dialog/AddUserDialog'
import EditUserDialog from './dialog/EditUserDialog'
import { DelUser, ChangeUserStatus } from '@/api/user'
import { global } from '@/utils/global'
export default {
  name: 'User',
  components: { SelectVue, TableVue, AddUserDialog, EditUserDialog },
  setup(props, { root, refs }) {
    const { confirm } = global()
    // vue3.0获取子组件的方法,这里的usertable要和ref="usertable"这个相同才行
    const usertable = ref(null)
    const data = reactive({
      UserDialog: false,
      dialog_edit: false,
      configOptions: {
        init: ['truename', 'phone']
      },
      configTable: {
        // 多选框
        selection: true,
        tHead: [
          {
            label: '用户名/邮箱',
            field: 'username',
            width: 200
          },
          {
            label: '真实姓名',
            field: 'truename',
            width: 100
          },
          {
            label: '手机号',
            field: 'phone'
          },
          {
            label: '地区',
            field: 'region'
          },
          {
            label: '角色',
            field: 'role'
          },
          {
            label: '禁启用角色',
            field: 'status',
            columnType: 'slot',
            slotName: 'status'
          },
          {
            label: '操作',
            columnType: 'slot',
            slotName: 'operation'
          }
        ],
        // 请求参数
        requestData: {
          url: 'getUserList',
          data: {
            pageNumber: 1,
            pageSize: 3
          }
        },
        // 控制分页的显示或隐藏,默认显示
        paginationShow: true,
        // 选择分页的组件，默认全选
        paginationLayout: 'total, sizes, prev, pager, next, jumper'
      },
      tableRow: {},
      // status节流阀
      ChangeSwitchFlag: false,
      // 编辑的数据
      editData: {},
      // 下拉选择数据
      selectData: {},
      // 搜素关键字
      keyWord: ''
    })
    // method

    // 搜索
    const search = () => {
      const requestData = {
        [data.selectData.value]: data.keyWord
      }
      // 调用子组件的方法，带参数的刷新页面
      refs.usertable.paramsRefreshData(requestData)
    }
    // 删除用户
    const delUser = params => {
      // 这里id必须用数组包裹
      data.tableRow.idItem = [params.id]
      confirm({
        content: '确认删除全部已选中内容，是否继续',
        tip: '警告',
        fn: confirmDelete
      })
    }
    // 全部删除
    const handlerbtnAllDel = () => {
      const userId = data.tableRow.idItem
      console.log(userId)
      if (!userId || userId.length === 0) {
        root.$message({
          message: '请选择需要删除的项',
          type: 'success'
        })
        return false
      }
      // 删除前确认
      confirm({
        content: '确认删除全部已选中内容，是否继续',
        tip: '警告',
        fn: confirmDelete
      })
    }
    // 确认删除
    const confirmDelete = () => {
      DelUser({ id: data.tableRow.idItem })
        .then(response => {
          console.log(response)
          // 删除后调接口刷新页面
          // 方法一：
          // refs.usertable.refreshData()
          // 方法二：
          refreshData()
        })
        .catch()
    }
    // 刷新数据
    const refreshData = () => {
      usertable.value.refreshData()
    }
    // 禁用/启用切换
    const handerSwitch = params => {
      // 为了防止点击太快，添加节流阀
      if (data.ChangeSwitchFlag) {
        return false
      }
      data.ChangeSwitchFlag = true
      // 发送请求修改状态
      ChangeUserStatus({ id: params.id, status: params.status })
        .then(response => {
          console.log(response)
          root.$message({
            message: response.data.message,
            type: 'success'
          })
          // 请求成功后，关闭
          data.ChangeSwitchFlag = !data.ChangeSwitchFlag
        })
        .catch(error => {
          console.log(error)
          // 发生错误时关闭
          data.ChangeSwitchFlag = !data.ChangeSwitchFlag
        })
    }
    // 添加用户
    const addUser = () => {
      data.UserDialog = true
    }
    // 编辑用户
    const editUser = params => {
      console.log(params)
      data.dialog_edit = true
      // 给子组件赋值
      data.editData = Object.assign({}, params)
      console.log('用户页面编辑')
      console.log(data.editData)
    }

    onMounted(() => {})

    return {
      usertable,
      data,
      delUser,
      editUser,
      addUser,
      handlerbtnAllDel,
      refreshData,
      handerSwitch,
      search
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/config';
.label-wrap {
  @include labelDom(left, 60, 40);
}
.footer {
  line-height: 40px;
}
</style>
