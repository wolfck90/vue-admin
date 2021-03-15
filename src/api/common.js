import { GetCategory, GetCategoryAll } from '@/api/news'
import { reactive } from '@vue/composition-api'
export function common() {
  const categoryData = reactive({
    item: []
  })
  const getCategory = () => {
    GetCategory()
      .then(response => {
        categoryData.item = response.data.data.data
      })
      .catch(error => {
        console.log(error)
      })
  }
  const getCategoryAll = () => {
    GetCategoryAll()
      .then(response => {
        categoryData.item = response.data.data
      })
      .catch(error => {
        console.log(error)
      })
  }

  return {
    categoryData,
    getCategory,
    getCategoryAll
  }
}
