<template>
  <div id="main_wrap">
    <div class="main-content">
      <div class="content">
        <!-- 子路由显示区 -->
        <keep-alive>
          <!-- 需要缓存的组件 -->
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <!-- 不缓存的组件 -->
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'layoutMain',
  setup(props, { root }) {}
}
</script>

<style lang="scss" scoped>
@import '../../../styles/config';
#main_wrap {
  height: 100vh;
  // position: fixed;
  // top: 75px;
  // left: $navMenu;
  // right: 0;
  // bottom: 0;
  // border: 30px solid #f7f7f7;
  // border-bottom: none;
  // -webkit-box-sizing: border-box;
}
.main-content {
  width: 100%;
  height: 100%;
  padding: $layoutHeader + 30 30px 0 $navMenu + 30;
  background-color: #f7f7f7;
  @include webkit(box-sizing, border-box);
  @include webkit(transition, all 0.3s ease 0s);
}
.open {
  .main-content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .main-content {
    padding-left: $navMenuMin + 30;
  }
}
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0 30px;
  background-color: #fff;
  @include webkit(box-sizing, border-box);
}
</style>
