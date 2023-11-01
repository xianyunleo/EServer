import { electronRequire } from '@/main/utils/electron'
import OS from '@/main/utils/OS'

const app = electronRequire('app')


export const isDev = !app.isPackaged
export const isWindows = OS.isWindows();
export const isMacOS = OS.isMacOS();
export function devConsoleLog(...str) {
    if (isDev) {
        console.log(...str)
    }
}
