<template>
  <div>
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '90%' }">
      <van-cell title="我的频道">
        <template #default>
          <van-button v-if="isEdit===false" plain round size="mini" type="danger" @click="isEdit=true">编辑</van-button>
          <van-button v-if="isEdit===true" plain round size="mini" type="danger" @click="isEdit=false">完成</van-button>
        </template>
      </van-cell>
      <van-grid :border='false'>
        <van-grid-item class="myitem" @click="changeActive(index)" v-for="(item , index) in channels" :key="index">
          <template #text>
            <span :class="{ active:activeIndex === index}">{{item.name}}</span>
            <van-icon v-if="isEdit" class="cross" name="clear" @click.stop="delChannel(index)"/>
          </template>
        </van-grid-item>
      </van-grid>

      <van-cell title="频道推荐"/>
      <van-grid :border='false'>
        <van-grid-item class="myitem" :text="item.name" v-for="(item , index) in tuijianChannel" :key="index"
                       @click="addChannel(item)">
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
import { apiGetAllChannels, apiResetChannels } from '../../../api/channel'
import { localSet } from '../../../utils/mylocal'

export default {
  name: 'channel',
  props: ['channels', 'activeIndex'],
  data () {
    return {
      show: false,
      isEdit: false,
      allChannelList: []
    }
  },
  computed: {
    tuijianChannel: function () {
      const ids = this.channels.map(val => {
        return val.id
      })
      const newArr = this.allChannelList.filter(obj => {
        return !ids.includes(obj.id)
      })
      return newArr
    }
  },
  methods: {
    async getAllChannel () {
      const res = await apiGetAllChannels()
      this.allChannelList = res.data.data.channels
    },
    async addChannel (item) {
      this.$set(item, 'articleList', [])
      this.$set(item, 'loading', false)
      this.$set(item, 'finished', false)
      this.$set(item, 'refreshing', false)
      this.channels.push(item)
      const token = this.$store.state.userInfo.token
      if (!token) {
        localSet('channels', this.channels)
      } else {
        const mapChannels = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        try {
          await apiResetChannels(mapChannels)
        } catch (e) {
          this.$toast('频道操作失败')
        }
      }
    },
    async delChannel (index) {
      this.channels.splice(index, 1)
      const token = this.$store.state.userInfo.token
      if (!token) {
        localSet('channels', this.channels)
      } else {
        const mapChannels = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })
        try {
          await apiResetChannels(mapChannels)
        } catch (e) {
          this.$toast('修改频道失败')
        }
      }
    },
    changeActive (index) {
      this.$emit('update:activeIndex', index)
    }
  },
  mounted () {
    this.getAllChannel()
  }
}
</script>

<style lang="less">
  .van-button--plain.van-button--danger .van-button__text {
    color: #ee0a24;
  }

  .myitem {
    position: relative;
    color: #646566;
    font-size: 12px;

    .cross {
      position: absolute;
      top: 5px;
      right: 10px;
    }

    .active {
      color: red;
    }
  }

</style>
