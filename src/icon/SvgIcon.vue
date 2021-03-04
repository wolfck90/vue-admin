<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import { computed } from '@vue/composition-api'
export default {
  name: 'svgIcon',
  //   props: ['className'],
  props: {
    iconClass: {
      type: String,
      default: ' '
    },
    className: {
      type: String,
      default: ' '
    }
  },
  setup(props) {
    // console.log(props.iconClass)
    // console.log(props.className)
    const iconName = computed(() => `#icon-${props.iconClass}`)
    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`
      } else {
        return 'svg-icon'
      }
    })
    return {
      iconName,
      svgClass
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
