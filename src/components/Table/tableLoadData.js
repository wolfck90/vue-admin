import { reactive } from '@vue/composition-api'
import { requestUrl } from '@/api/requestUrl'
import { GetUserList } from '@/api/common'
export function LoadData() {
  const TableData = reactive({
    item: [],
    total: 0
  })

  const LoadTableData = params => {
    const requestJson = params
    const requestData = {
      url: requestUrl[requestJson.url],
      method: requestJson.method,
      data: requestJson.data
    }
    GetUserList(requestData)
      .then(response => {
        const responseData = response.data.data.data
        if (responseData && responseData.length > 0) {
          TableData.item = responseData
          TableData.total = response.data.data.total
        }
      })
      .catch()
  }
  return {
    TableData,
    LoadTableData
  }
}

/*
   table组件请求数据：
   LoadTableData请求接口，从接口获取数据赋值给TableData.item，然后将数据返回到Table组件中，然后在Table组件中通过事件监听watch，将TableData.item 赋值data.tableData

*/
