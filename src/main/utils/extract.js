import extract from 'extract-zip'
import * as fs from 'fs'

export async function extractZip(path, dest) {
    return await extract(path, {dir: dest});
}

export async function extractTarXz(path, dest) {
    const lzma = require('lzma-native')
    const tar = require('tar')
    const { pipeline } = require('stream/promises')

    await pipeline(
        // 1. 读取.xz文件
        fs.createReadStream(path),

        // 2. 使用lzma-native解压xz流
        lzma.createDecompressor(),

        // 3. 将解压后的tar流直接解包到目标目录
        tar.extract({ cwd: dest })
    )
}
