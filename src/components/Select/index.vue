<template>
  <div>
    <el-select v-model="data.selectValue" placeholder="请选择" @change = "select">
      <el-option v-for="item in data.selectInit" :key="item.value" :label="item.label" :value="item.value"> </el-option>
    </el-select>
  </div>
</template>

<script>
import { reactive, onMounted } from '@vue/composition-api'
export default {
  name: 'SelectVue',
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    selectData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const data = reactive({
      selectValue: '',
      selectInit: [],
      options: [
        {
          value: 'truename',
          label: '姓名'
        },
        {
          value: 'phone',
          label: '手机号'
        },
        {
          value: 'id',
          label: 'ID'
        },
        {
          value: 'title',
          label: '标题'
        }
      ]
    })
    // 初始化下拉选择框
    const initOptions = () => {
      const initData = props.config.init
      const OptionArr = []
      // 判断传过来的值是否存在
      if (initData.length === 0) {
        console.log('无法获取config的值，请检查相关数据')
        return false
      }
      // 将接收到的数据遍历
      initData.forEach(item => {
        const arr = data.options.filter(ele => ele.value === item)
        // 判断值是否匹配,如果不匹配,arr为空数组,不能push到OptionArr中
        if (arr.length > 0) {
          OptionArr.push(arr[0])
        }
      })
      // 如果数据不匹配，那么arr就是空数组，不会push到OptionArr中，OptionArr也是空数组，OptionArr[0]仍然回报错，所以还要在校验下数据
      if (OptionArr.length === 0) {
        console.log('无法匹配数据')
        return false
      }
      data.selectInit = OptionArr
      data.selectValue = data.selectInit[0].value
      // 返回初始值到父组件
      emit('update:selectData', OptionArr[0])
    }

    const select = (val) => {
      // 过滤，将data.options中value === val的数据过滤出来，返回给父组件
      const filterData = data.options.filter(item => item.value === val)[0]
      // console.log(filterData)
      emit('update:selectData', filterData)
    }
    onMounted(() => {
      initOptions()
    })
    return {
      data,
      initOptions,
      select
    }
  }
}
</script>

<style scoped></style>
