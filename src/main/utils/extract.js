import extract from 'extract-zip'
import * as fsPromises from 'fs/promises'

export async function extractZip(path, dest) {
    return await extract(path, { dir: dest })
}

export async function extractTarXz(path, dest) {
    const lzma = require('@napi-rs/lzma/xz')
    const buffer = await fsPromises.readFile(path)
    const buffer2 = await lzma.decompress(buffer)
    const tar = require('tar')
    const { pipeline } = require('stream/promises')
    const { Readable } = require('node:stream')

    await pipeline(
        // 1. 读取.xz文件
        Readable.from(buffer2),
        // 3. 将解压后的tar流直接解包到目标目录
        tar.extract({ cwd: dest })
    )
}
