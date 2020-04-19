import myHttp from '../utils/myhttp'

export function apiLogin ({ mobile, code }) {
  return myHttp({
    url: '/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}
