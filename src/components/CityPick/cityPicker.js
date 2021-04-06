import { reactive } from '@vue/composition-api'
import { GetCityPick } from '@/api/common'
export function cityPicker() {
  const data = reactive({
    provinceValue: '',
    cityValue: '',
    areaValue: '',
    streetValue: '',
    provinceData: [],
    cityData: [],
    areaData: [],
    streetData: []
  })

  // 返回数据
  const resultData = reactive({
    provinceValue: '',
    cityValue: '',
    areaValue: '',
    streetValue: ''
  })

  // 获取省份信息
  const getProvince = () => {
    getData({ type: 'province' })
  }
  // 选择省份，获取城市
  const handlerProvince = val => {
    resetValue({ type: 'city' })
    getData({ type: 'city', province_code: val })
  }
  // 选择城市，获取区域
  const handlerCity = val => {
    resetValue({ type: 'area' })
    getData({ type: 'area', city_code: val })
  }
  // 选择区域，获取街道
  const handlerArea = val => {
    resetValue({ type: 'street' })
    getData({ type: 'street', area_code: val })
  }
  // 选择街道
  const handlerStreet = val => {
    resetValue({ type: '' })
  }
  // 获取数据
  const getData = requestData => {
    GetCityPick(requestData).then(response => {
      data[`${requestData.type}Data`] = response.data.data.data
    })
  }

  // 数据重置
  const resetValue = params => {
    const valueJson = {
      city: ['cityValue', 'areaValue', 'streetValue', 'cityData', 'areaData', 'streetData'],
      area: ['areaValue', 'streetValue', 'areaData', 'streetData'],
      street: ['streetValue', 'streetData']
    }
    const tempObj = valueJson[params.type]
    if (tempObj) {
      tempObj.forEach(item => {
        data[item] = ''
      })
    }
    result()
  }

  // 数据集合，然后返回
  const result = () => {
    for (const key in resultData) {
      resultData[key] = data[key]
    }
  }
  return {
    data,
    resultData,
    getProvince,
    handlerProvince,
    handlerCity,
    handlerArea,
    handlerStreet
  }
}
