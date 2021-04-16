<template>
  <div id="header_wrap">
    <div class="pull-left header-icon" @click="menuCollapse()">
      <svg-icon iconClass="menu" className="menu"></svg-icon>
    </div>
    <div class="pull-right">
      <div class="pull-left user-info">
        <img src="../../../assets/images/face.png" alt="" />
        {{ username }}
      </div>
      <div class="pull-left header-icon" @click="logout"><svg-icon iconClass="exit" className="exit"></svg-icon></div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
export default {
  name: 'layoutHeader',
  setup(props, { root }) {
    const menuCollapse = () => {
      root.$store.commit('app/set_collapse')
    }
    const username = computed(() => root.$store.state.app.username)
    // console.log(username.value)
    // 退出
    const logout = () => {
      root.$store.dispatch('app/logout').then((response) => {
        console.log(response)
        if (response.resCode === 0) {
          root.$message({
            message: '退出成功',
            type: 'success'
          })
        }
        // 路由跳转到login页面
        root.$router.replace({ name: 'Login' })
      })
    }
    return {
      menuCollapse,
      username,
      logout
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/config';
#header_wrap {
  position: fixed;
  top: 0;
  right: 0;
  height: 75px;
  background-color: #fff;
  line-height: 75px;
  z-index: 3;
  // box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
}
.open {
  #header_wrap {
    left: $navMenu;
  }
}
.close {
  #header_wrap {
    left: $navMenuMin;
  }
}
.header-icon {
  padding: 0 32px;
  svg {
    font-size: 25px;
    margin-bottom: -4px;
    cursor: pointer;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon {
    padding: 0 28px;
  }
  img {
    display: inline-block;
    width: 36px;
    height: 36px;
    margin-right: 10px;
    vertical-align: middle;
    border-radius: 18px;
  }
}
</style>
