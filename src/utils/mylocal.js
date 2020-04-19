export function localSet (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function localGet (key) {
  return JSON.parse(window.localStorage.getItem(key))
}

export function localDel (key) {
  window.localStorage.removeItem(key)
}
