import { reactive } from '@vue/composition-api'

export function paginationHook() {
  const pageData = reactive({
    currentPage: 1,
    pageSize: 3,
    pageSizes: [3, 5, 10, 20],
    total: 50
  })

  // 将获取到的total赋值给pageData的total
  const totalCount = val => {
    pageData.total = val
  }
  const handleSizeChange = (val) => { pageData.pageSize = val }

  const handleCurrentChange = (val) => { pageData.currentPage = val }

  return {
    pageData,
    totalCount,
    handleSizeChange,
    handleCurrentChange
  }
}
