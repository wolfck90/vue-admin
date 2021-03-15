import service from '@/utils/request.js'

// 添加一级信息分类

export function AddFirstCategory(data) {
  return service.request({
    method: 'post',
    url: '/news/addFirstCategory/',
    data
  })
}

// 添加二级分类信息
export function AddChildrenCategory(data) {
  return service.request({
    method: 'post',
    url: '/news/addChildrenCategory/',
    data
  })
}

// 获取分类（不包含子级）
export function GetCategory(data) {
  return service.request({
    method: 'post',
    url: '/news/getCategory/',
    data
  })
}

// 获取分类(包含子级)
export function GetCategoryAll(data) {
  return service.request({
    method: 'post',
    url: '/news/getCategoryAll/',
    data
  })
}

// 删除一级分类
export function DeleteCategory(data) {
  return service.request({
    method: 'post',
    url: '/news/deleteCategory/',
    data
  })
}

// 编辑一级分类
export function EditFirstCategory(data) {
  return service.request({
    method: 'post',
    url: '/news/editCategory/',
    data
  })
}

// 新增信息
export function AddInfo(data) {
  return service.request({
    method: 'post',
    url: '/news/add/',
    data
  })
}

// 获取列表信息
export function GetList(data) {
  return service.request({
    method: 'post',
    url: '/news/getList/',
    data
  })
}

// 删除信息
export function DeleteInfo(data) {
  return service.request({
    method: 'post',
    url: '/news/deleteInfo/',
    data
  })
}

// 编辑信息
export function EditInfo(data) {
  return service.request({
    method: 'post',
    url: '/news/editInfo/',
    data
  })
}
