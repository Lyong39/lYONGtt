<template>
  <div class="search">
    <form action="/">
      <van-search
        v-model="value"
        show-action
        background="#3296FA"
        @search="onSearch"
        @cancel="onCancel"
        @input="think"/>
    </form>
    <van-cell-group v-if="searchList.length!==0">
      <van-cell icon="search" v-for="(item , index) in searchList" :key="index" @click="onSearch(item.oldItem)">
        <template #title>
          <div v-html="item.newItem"></div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template #default>
          <van-icon name="delete"/>
        </template>
      </van-cell>
      <van-cell icon="browsing-history-o" v-for="(itme,index) in historyList" :key="index" :title="itme" >
        <template #default>
          <van-icon name="cross"/>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { apiThink } from '../../api/search'
import { localGet, localSet } from '../../utils/mylocal'

export default {
  name: 'index',
  data () {
    return {
      value: '',
      searchList: [],
      timer: null,
      historyList: localGet('history') || []
    }
  },
  methods: {
    onSearch (val) {
      this.$router.push({
        path: '/searchResult',
        query: {
          key: val
        }
      })
      this.historyList.unshift(val)
      localSet('history', this.historyList)
      this.historyList = new Set([...this.historyList])
    },
    onCancel () {
      Toast('取消')
    },
    think () {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (this.value.trim() !== '') {
          const res = await apiThink(this.value)
          console.log(res)
          if (res.data.data.options.length === 0) {
            this.searchList = []
            this.searchList.push({
              oldItem: `很抱歉,没有找到与${this.value}相关的内容。`,
              newItem: `很抱歉,没有找到与${this.value}相关的内容。`
            })
          } else {
            const mapSearchList = res.data.data.options.map(val => {
              return {
                oldItem: this.value,
                newItem: val.replace(this.value, `<span style="color: red">${this.value}</span>`)
              }
            })
            this.searchList = mapSearchList
          }
        } else {
          this.searchList = []
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less">
  .search {
    .van-search__action {
      color: #fff
    }

    .van-search__action:active {
      background-color: #cccccc;
    }
  }

</style>
