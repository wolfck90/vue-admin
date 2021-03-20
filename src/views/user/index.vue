<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label for="">关键字：</label>
          <div class="wrap-content">
            <el-row :gutter="16">
              <el-col :span="3">
                <SelectVue :config="data.configOptions"></SelectVue>
              </el-col>
              <el-col :span="5"><el-input placeholder="请输入关键字"></el-input></el-col>
              <el-col :span="12"><el-button type="danger" size="medium">搜索</el-button></el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right" size="medium" @click="addUser()">添加用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <!-- 表格 -->
    <TableVue :configTable="data.configTable">
      <template v-slot:status="slotData">
        <el-switch v-model="slotData.data.status" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button size="mini" type="danger" @click="delUser(slotData.data)">删除</el-button>
        <el-button size="mini" type="success" @click="editUser(slotData.data)">编辑</el-button>
      </template>
    </TableVue>
  </div>
</template>

<script>
import { reactive, onMounted } from '@vue/composition-api'
// 导入组件
import SelectVue from '@c/Select'
import TableVue from '@c/Table'
import service from '@/utils/request.js'
export default {
  name: 'User',
  components: { SelectVue, TableVue },
  setup(props) {
    const data = reactive({
      configOptions: {
        init: ['name', 'phone']
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
            field: 'address'
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
      }
    })
    // method

    const delUser = params => {
      console.log(params)
    }
    const editUser = params => {
      console.log(params)
    }
    const addUser = () => {
      const info = {
        username: '513254291@qq.com',
        truename: '智叟',
        password: '123456x',
        phone: '1234517814',
        region: '北京',
        status: 'true',
        role: '员工'
      }
      service
        .request({
          method: 'post',
          url: '/user/add/',
          data: info
        })
        .then(response => {
          console.log(response)
        })
    }
    onMounted(() => {})

    return {
      data,
      delUser,
      editUser,
      addUser
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
