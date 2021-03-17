<template>
  <div id="nav-wrap">
    <h1 class="logo">
      <img src="../../../assets/logo.png" alt="" />
    </h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item, index) in routers">
        <el-submenu v-if="!item.hidden" :index="index + ''" :key="item.id">
          <!-- 一级菜单 -->
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"></svg-icon>
            <span slot="title">{{ item.meta.name }}</span>
          </template>
          <!-- 子菜单 -->
          <template v-for="subItem in item.children" >
            <el-menu-item :index="subItem.path" v-if="!subItem.hidden" :key="subItem.id"
              >{{ subItem.meta.name }}
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { reactive, computed } from '@vue/composition-api'
export default {
  name: 'Nav',
  setup(props, { root }) {
    // const isCollapse = ref(false)
    const routers = reactive(root.$router.options.routes)
    // 使用计算属性computed监听isCollapse的值
    const isCollapse = computed(() => root.$store.state.app.isCollapse)
    // console.log(routers)
    const handleOpen = (key, keyPath) => {
      // console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      // console.log(key, keyPath)
    }

    return {
      routers,
      isCollapse,
      handleOpen,
      handleClose
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/config';
#nav-wrap {
  position: fixed;
  left: 0;
  top: 0;
  // width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  @include webkit(transition, all 0.3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
.logo {
  text-align: center;
  img {
    margin: 28px auto 25px;
    width: 92px;
    @include webkit(transition, all 0.3s ease 0s);
  }
}
.open {
  #nav-wrap {
    width: $navMenu;
  }
}
.close {
  #nav-wrap {
    width: $navMenuMin;
  }
  .logo img {
    width: 60%;
  }
}
</style>
