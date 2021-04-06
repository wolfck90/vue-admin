<template>
  <div class="overflow-h">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-select v-model="data.provinceValue" @change="handlerProvince">
          <el-option
            v-for="item in data.provinceData"
            :key="item.PROVINCE_CODE"
            :label="item.PROVINCE_NAME"
            :value="item.PROVINCE_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="data.cityValue" @change="handlerCity">
          <el-option
            v-for="item in data.cityData"
            :key="item.CITY_CODE"
            :label="item.CITY_NAME"
            :value="item.CITY_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="data.areaValue" @change="handlerArea">
          <el-option
            v-for="item in data.areaData"
            :key="item.AREA_CODE"
            :label="item.AREA_NAME"
            :value="item.AREA_CODE"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="data.streetValue" @change="handlerStreet">
          <el-option
            v-for="item in data.streetData"
            :key="item.STREET_CODE"
            :label="item.STREET_NAME"
            :value="item.STREET_CODE"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { cityPicker } from './cityPicker'
import { onBeforeMount, watch } from '@vue/composition-api'
export default {
  name: 'CityPick',
  props: {
    cityPickerData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    //  组件方法
    const { getProvince, handlerProvince, handlerCity, handlerArea, handlerStreet, data, resultData } = cityPicker()

    watch(
      [
        () => resultData.provinceValue,
        () => resultData.cityValue,
        () => resultData.areaValue,
        () => resultData.streetValue
      ],
      ([province, city, area, street]) => {
        emit('update:cityPickerData', resultData)
      }
    )

    onBeforeMount(() => {
      getProvince()
    })
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
}
</script>

<style lang="scss" scoped></style>
