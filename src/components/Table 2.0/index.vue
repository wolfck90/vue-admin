<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column v-if="tableConfig.selection" type="selection" width="45"> </el-table-column>
      <template v-for="item in tableConfig.tHead">
        <el-table-column
          v-if="item.columnType === 'slot'"
          :key="item.field"
          :label="item.label"
          :prop="item.field"
          :width="item.width"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column :key="item.field" :label="item.label" :prop="item.field" :width="item.width" v-else>
        </el-table-column>
      </template>
    </el-table>
    <div class="black-space-20"></div>
    <el-button size="medium">批量删除</el-button>
    <el-pagination
      class="right"
      v-if="tableConfig.paginationShow"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="tableConfig.paginationLayout"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import tableLoadData from '@/mixins/tableLoadData'
import paginationHook from '@/mixins/paginationHook'
export default {
  name: 'TableVue',
  // 注入混入的
  mixins: [tableLoadData, paginationHook],
  props: {
    configTable: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // table配置项，selection:控制左边勾选框的显示和隐藏。tHead：表头
      tableConfig: {
        // 多选框
        selection: true,
        // 表头
        tHead: [],
        // 请求的数据
        requestData: {},
        // 是否显示页码
        paginationShow: true,
        // 选择页码功能
        paginationLayout: 'total, sizes, prev, pager, next, jumper'
      },
      // table数据
      tableData: []
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    // 初始化table表格数据
    initTable() {
      const configTableData = this.configTable
      // object.keys() 1.传入对象，返回属性名。2.传入字符串，返回索引 3.构造函数，返回空数组或对象名
      const keys = Object.keys(configTableData)
      // console.log(keys)
      // includes() 查看数组中是否包含某个元素
      for (const key in configTableData) {
        if (keys.includes(key)) {
          this.tableConfig[key] = configTableData[key]
        }
        // if (data.tableConfig[key]) {
        //   data.tableConfig[key] = configTableData[key]
        // }
      }
    }
  }

  // 监听TableData的数据变化，如果发生变化，将数值传给tableData
  // watch(
  //   [() => TableData.item, () => TableData.total],
  //   ([TableData, total]) => {
  //     // 需要添加数据，这里数据库没有数据
  //     data.tableData = TableData
  //     totalCount(total)
  //   }
  // )
  // // 监听页码数据
  // watch(
  //   [() => pageData.currentPage, () => pageData.pageSize],
  //   ([currentPage, pageSize]) => {
  //     const requestData = data.tableConfig.requestData
  //     // 第一次进入页面，因为页码没发生改变，不会触发监听器，所以requestData这里没有数据，当页码发生改变后，requestData里面会有data选项，里面包含了pageNumber，pageSize
  //     if (requestData.data) {
  //       // 更新数据
  //       requestData.data.pageNumber = currentPage
  //       requestData.data.pageSize = pageSize
  //       // 调接口
  //       LoadTableData(data.tableConfig.requestData)
  //     }
  //   })
}
</script>

<style lang="scss" scoped>
.black-space-20 {
  height: 20px;
}
.right {
  float: right;
}
</style>
