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
        <el-button type="danger" class="pull-right" size="medium">添加用户</el-button>
      </el-col>
    </el-row>
    <div class="black-space-30"></div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="username" label="用户名/邮箱" width="180"> </el-table-column>
      <el-table-column prop="truename" label="真实姓名" width="180"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="area" label="地区"> </el-table-column>
      <el-table-column prop="role" label="角色"> </el-table-column>
      <el-table-column label="禁启用状态"> </el-table-column>
      <el-table-column label="操作"> </el-table-column>
    </el-table>
    <div class="black-space-30"></div>
    <!-- 底部区域 -->
    <el-row class="footer">
      <el-col :span="4">
        <el-button>批量删除</el-button>
      </el-col>
      <el-col :span="20">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[3, 5, 8, 10]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetList } from '@/api/user'
import { reactive, onMounted } from '@vue/composition-api'
// 导入组件
import SelectVue from '@c/Select'
export default {
  name: 'User',
  components: { SelectVue },
  setup(props) {
    const data = reactive({
      configOptions: {
        init: ['name', 'phone']
      }
    })
    const tableData = reactive([
      {
        username: '123@qq.com',
        truename: '张三',
        phone: '12345678991',
        pageNumber: '1',
        pageSize: '1'
      },
      {
        username: '123@qq.com',
        truename: '张三',
        phone: '12345678991',
        pageNumber: '1',
        pageSize: '1'
      },
      {
        username: '123@qq.com',
        truename: '张三',
        phone: '12345678991',
        pageNumber: '1',
        pageSize: '1'
      }
    ])

    // method
    const getList = () => {
      const requestData = {
        username: '',
        truename: '',
        phone: '',
        pageNumber: 1,
        pageSize: 10
      }
      GetList(requestData).then(response => {
        console.log(response)
      })
    }

    const handleSizeChange = () => {}
    const handleCurrentChange = () => {}
    onMounted(() => {
      getList()
    })

    return {
      data,
      tableData,
      handleSizeChange,
      handleCurrentChange
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
