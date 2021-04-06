import { requestUrl } from '@/api/requestUrl'
import { GetUserList } from '@/api/common'
const tableLoadData = {
  data() {
    return {}
  },
  mounted() {
    this.loadTableData()
  },
  methods: {
    loadTableData() {
      const requestJson = this.tableConfig.requestData
      console.log(requestJson)
      const requestData = {
        url: requestUrl[requestJson.url],
        method: requestJson.method,
        data: requestJson.data
      }
      GetUserList(requestData)
        .then(response => {
          const responseData = response.data.data.data
          console.log(responseData)
          if (responseData && responseData.length > 0) {
            this.tableData = responseData
            this.total = response.data.data.total
          } else {
            this.tableData = responseData
          }
        })
        .catch()
    }
  }
}

export default tableLoadData
