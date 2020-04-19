<template>
    <div>
      <router-view/>
      <van-tabbar route>
        <van-tabbar-item icon="home-o" to="/index">主页</van-tabbar-item>
        <van-tabbar-item icon="search" to="/search">问答</van-tabbar-item>
        <van-tabbar-item icon="friends-o" to="/video">视频</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/my">我的</van-tabbar-item>
      </van-tabbar>
    </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style lang="less">
</style>
