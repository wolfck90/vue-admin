import { GetCategory, GetCategoryAll } from '@/api/news'
import { reactive } from '@vue/composition-api'
import service from '@/utils/request.js'
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

// 获取七牛云token
export function QiniuToken(data) {
  return service.request({
    method: 'post',
    url: '/uploadImgToken/',
    data
  })
}

// 获取用户列表的数据
export function GetUserList(params) {
  return service.request({
    method: params.method || 'post',
    url: params.url,
    data: params.data
  })
}
/*
  @params {
    province: 省
    city: 市
    aera: 区
    street：街道
  }

*/
// 获取省市区
export function GetCityPick(data) {
  return service.request({
    method: 'post',
    url: '/cityPicker/',
    data
  })
}
