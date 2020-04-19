<template>
  <div>
    <van-nav-bar title="登录"/>
    <van-form @submit="onSubmit">
      <van-field
        v-model="obj.mobile"
        left-icon="smile-o"
        placeholder="请输入手机号"
        name="mobile"
        :rules="[{ pattern, message: '手机号格式错误' }]">
        <template #left-icon>
          <i class="iconfont icon-phone"></i>
        </template>
      </van-field>
      <van-field
        v-model="obj.code"
        left-icon="music-o"
        placeholder="请输入验证码"
        name="code"
        :rules="[{validator , message: '请输入正确的验证码'}]">
        <template #button>
          <van-button size="small" color="#ededed" round type="primary">发送验证码</van-button>
        </template>
        <template #left-icon>
          <i class="iconfont icon-lock"></i>
        </template>
      </van-field>
      <div class="btn">
        <van-button type="info" block size="large" :loading="isLoading" loading-type="spinner" native-type="submit">登录</van-button>
      </div>
    </van-form>

  </div>
</template>

<script>

import { apiLogin } from '../../api/user'

export default {
  name: 'index',
  data () {
    return {
      obj: {
        mobile: '',
        code: ''
      },
      pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
      isLoading: false
    }
  },
  methods: {
    validator (val) {
      return val.length === 6
    },
    async onSubmit (values) {
      try {
        this.isLoading = true
        const res = await apiLogin(values)
        // 将返回数据保存到store 和 localStorage
        this.$store.commit('setUserInfo', res.data.data)
        this.isLoading = false
        this.$router.push('/index')
      } catch (e) {
        this.isLoading = false
        this.$toast.fail('登录失败,请检查验证码！')
      }
    }
  }
}
</script>

<style lang="less">
  .van-nav-bar.van-hairline--bottom {
    background-color: #3e9df8;

    .van-nav-bar__title {
      color: #fff
    }
  }

  .van-button__text {
    color: #999;
  }

  .btn {
    margin: 30px 20px;

    .van-button__text {
      color: #fff;
    }
  }
</style>
