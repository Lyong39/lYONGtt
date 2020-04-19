<template>
  <div>
    <van-nav-bar title="首页" fixed/>
    <van-tabs v-model="active">
      <van-tab v-for="(item,index) in channelList" :title="item.name" :key="index">
        <!--下拉刷新组件-->
        <van-pull-refresh v-model="item.refreshing" @refresh="onRefresh">
          <!--上拉list加载组件-->
          <van-list
            v-model="item.loading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad">
            <van-cell v-for="(article,index) in item.articleList" :key="index">
              <template #title>
                <h3>{{article.title}}</h3>
                <van-grid v-if="article.cover.type !== 0" :border="false">
                  <van-grid-item v-for="(imgItem,imageIndex) in article.cover.images" :key="imageIndex">
                    <van-image lazy-load :src="imgItem"/>
                  </van-grid-item>
                </van-grid>
                <div class="content">
                  <div class="left">
                    <span>{{article.aut_name}}</span>
                    <span>{{article.comm_count}}</span>
                    <span>{{article.pubdate | timeFilter}}</span>
                  </div>
                  <div class="right" @click="openMore(article)">
                    <van-icon name="cross"/>
                  </div>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <div class="channelBtn" @click="openPopup">
      <van-icon name="wap-nav"/>
    </div>
    <!--    <channel :channels="channelList" :activeIndex="active" @changeActiveIndex="index=>this.active=index" ref="channel"/>-->
    <!--  父组件与子组件 sync数据双向绑定  -->
    <channel :channels="channelList" :activeIndex.sync="active" ref="channel"/>
    <more :artid="artid" :autid="autid" @delArt="delArt(artid)" @pullBlack="pullBlack(autid)" ref="more"/>
  </div>
</template>

<script>
import { apiGetChannels } from '../../api/channel'
import { localGet } from '../../utils/mylocal'
import { apiGetArticleList, apiPullBlack } from '../../api/article'
import channel from './components/channel'
import more from './components/more'
import Vue from 'vue'
import { Lazyload } from 'vant'
Vue.use(Lazyload)
export default {
  name: 'index',
  mounted () {
    this.getChannels()
  },
  data () {
    return {
      refreshing: false, // 下拉刷新
      channelList: [], // 头条话题
      active: '', // 当前选中的channel下标
      artid: 0, // 被点击的文章id
      autid: 0 // 被点击的作者id
    }
  },
  methods: {
    // 下拉刷新
    onRefresh () {
      const currentChannel = this.channelList[this.active]
      currentChannel.finished = false
      currentChannel.loading = true
      this.onLoad()
    },
    // 懒加载
    async onLoad () {
      const currentChannel = this.channelList[this.active]

      if (currentChannel.refreshing) {
        currentChannel.articleList = []
        currentChannel.refreshing = false
      }

      const id = currentChannel.id
      const res = await apiGetArticleList({
        channelId: id,
        timestamp: Date.now()
      })
      currentChannel.articleList.push(...res.data.data.results)
      currentChannel.loading = false
      if (res.data.data.results.length === 0) {
        currentChannel.finished = true
      }
    },
    // 获取头条话题数据
    async getChannels () {
      const token = this.$store.state.userInfo.token
      if (token) {
        try {
          const res = await apiGetChannels()
          this.channelList = res.data.data.channels
        } catch (e) {
          this.$toast('获取数据失败!')
        }
      } else {
        const localChannels = localGet('channels')
        if (localChannels) {
          this.channelList = localChannels
        } else {
          try {
            const res = await apiGetChannels()
            this.channelList = res.data.data.channels
          } catch (e) {
            this.$toast('获取数据失败!')
          }
        }
      }
      this.addOtherPro()
    },
    // 给每个头条话题添加属于自己的属性
    addOtherPro () {
      this.channelList.forEach(value => {
        this.$set(value, 'articleList', [])
        this.$set(value, 'loading', false)
        this.$set(value, 'finished', false)
        this.$set(value, 'refreshing', false)
      })
    },
    // 打开头条话题操作面板
    openPopup () {
      this.$refs.channel.show = true
    },
    // 打开文章操作面板
    openMore (article) {
      this.$refs.more.show = true
      this.artid = article.art_id
      this.autid = article.aut_id
    },
    // 删除文章
    delArt (artid) {
      this.channelList[this.active].articleList.forEach((item, index) => {
        if (item.art_id === artid) {
          this.channelList[this.active].articleList.splice(index, 1)
        }
      })
      this.$refs.more.show = false
    },
    // 拉黑作者并删除作者文章
    // todo 拉黑作者删除文章有问题
    async pullBlack (autid) {
      try {
        await apiPullBlack(autid)
        for (let i = 0; i < this.channelList[this.active].articleList.length; i++) {
          if (this.channelList[this.active].articleList[i].aut_id === autid) {
            this.channelList[this.active].articleList.splice(i, 1)
          }
        }
        // arr.splice(index,1);forEach遍历删除数组元素后会改变原数组。
        // this.channelList[this.active].articleList.forEach((item, index) => {
        //   if (item.aut_id === autid) {
        //     this.channelList[this.active].articleList.splice(index, 1)
        //   }
        // })
        this.$toast.success('拉黑作者成功!')
      } catch (e) {
        this.$toast.fail('拉黑作者失败!')
      }
      this.$refs.more.show = false
    }
  },
  components: {
    channel,
    more
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

  .van-tabs.van-tabs--line {
    margin-top: 46px;
    margin-bottom: 50px;

    .van-tabs__wrap.van-hairline--top-bottom {
      position: fixed;
      top: 46px;
      width: 90%;
    }

    .van-tabs__content {
      margin-top: 90px;
    }
  }

  .channelBtn {
    position: fixed;
    top: 46px;
    right: 0px;
    height: 44px;
    width: 10%;
    text-align: center;
    line-height: 44px;
    background-color: #cccccc;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      span {
        margin-right: 10px;
        color: #999;
        font-size: 12px;
      }
    }

    .right {
      border: 1px solid #ccc;
      height: 14px;
      padding: 0 5px;
      line-height: 14px;
      color: #999;
    }
  }

</style>
