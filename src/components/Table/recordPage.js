// table 组件分页
import { ref } from '@vue/composition-api'

export function recordPage() {
  const page = ref(11)

  const changePage = () => {}

  return {
    page,
    changePage
  }
}
