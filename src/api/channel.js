import myHttp from '../utils/myhttp'

export function apiGetChannels () {
  return myHttp({
    url: '/user/channels'
  })
}

export function apiGetAllChannels () {
  return myHttp({
    url: '/channels'
  })
}

export function apiResetChannels (channels) {
  return myHttp({
    url: '/user/channels',
    method: 'PUT',
    data: {
      channels
    }
  })
}
