import myhttp from '../utils/myhttp'

export function apiThink (key) {
  return myhttp({
    url: '/suggestion',
    params: {
      q: key
    }
  })
}
