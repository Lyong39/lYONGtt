import myHttp from '../utils/myhttp'

export function apiGetArticleList ({ channelId, timestamp }) {
  return myHttp({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: 0
    }
  })
}

export function apiDisLike (artid) {
  return myHttp({
    url: '/article/dislikes',
    method: 'POST',
    data: {
      target: artid
    }
  })
}

export function apiReport ({ artid, type }) {
  return myHttp({
    url: '/article/reports',
    method: 'POST',
    data: {
      target: artid,
      type: type,
      remark: ''
    }
  })
}

export function apiPullBlack (autid) {
  return myHttp({
    url: '/user/blacklists',
    method: 'POST',
    data: {
      target: autid
    }
  })
}
