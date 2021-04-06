const paginationHook = {
  data() {
    return {
      currentPage: 1,
      pageSize: 3,
      pageSizes: [3, 5, 10, 20],
      total: 0
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    handleSizeChange(val) {
      this.tableConfig.requestData.data.pageSize = val
      this.loadTableData()
    },
    handleCurrentChange(val) {
      this.tableConfig.requestData.data.pageNumber = val
      this.loadTableData()
    }
  }
}

export default paginationHook
