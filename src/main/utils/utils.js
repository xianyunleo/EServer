import { sep } from 'path'
import OS from '@/main/utils/OS'

export const isDev = process.resourcesPath.includes(`${sep}node_modules${sep}`)

export const isWindows = OS.isWindows()
export const isMacOS = OS.isMacOS()

export function devConsoleLog(...str) {
    if (isDev) {
        console.log(...str)
    }
}

export function replaceLineBreak(str) {
    if (isWindows) {
        return str.replaceAll('\n', '\r\n')
    } else {
        return str.replaceAll('\r\n', '\n')
    }
}
