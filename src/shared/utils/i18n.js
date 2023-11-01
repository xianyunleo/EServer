import I18n from '@/renderer/i18n/i18n'

const { t: originT } = I18n.getInstance().global

export function t(...arg) {
  return originT(...arg)
}

export function mt(...args) {
  let str = ''
  for (const arg of args) {
    str += originT(arg)
  }
  return str
}


