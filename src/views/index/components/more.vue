<template>
  <van-popup v-model="show" class="mycell">
    <van-cell-group v-if="isReport===false">
      <van-cell title="不感兴趣" @click="dislike">
        <template #icon>
          <i class="iconfont icon-buganxingqu"></i>
        </template>
      </van-cell>
      <van-cell icon="warning-o" @click="isReport=true" title="反馈垃圾内容" is-link/>
      <van-cell icon="delete" @click="pullBlack" title="拉黑作者"/>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell @click="isReport=false" icon="arrow-left"/>
      <van-cell v-for="(item,index) in reportType" :key="index" @click="report(item.id)" :title="item.type"/>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { apiDisLike, apiReport } from '../../../api/article'

export default {
  name: 'more',
  props: ['artid', 'autid'],
  data () {
    return {
      show: false,
      reportType: [
        { id: 0, type: '其他问题' },
        { id: 1, type: '标题夸张' },
        { id: 2, type: '低俗色情' },
        { id: 3, type: '错别字多' },
        { id: 4, type: '旧闻重复' },
        { id: 5, type: '广告软文' },
        { id: 6, type: '内容不实' },
        { id: 7, type: '涉嫌违法犯罪' },
        { id: 8, type: '侵权' }
      ],
      isReport: false
    }
  },
  methods: {
    // 文章不喜欢
    async dislike () {
      this.$emit('delArt', this.artid)
      await apiDisLike(this.artid)
    },
    // 文章举报
    async report (id) {
      try {
        await apiReport({
          artid: this.artid,
          type: id
        })
        this.$toast.success('举报成功!')
      } catch (e) {
        this.$toast.fail('举报失败!')
      }
      this.show = false
      this.isReport = false
    },
    // 拉黑作者
    pullBlack () {
      this.$emit('pullBlack', this.autid)
    }
  }
}
</script>

<style lang="less">
  .mycell {
    width: 90%;
    border-radius: 5px;
    .icon-buganxingqu {
      margin-right: 5px;
    }
  }
</style>
