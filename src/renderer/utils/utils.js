import { defineAsyncComponent } from 'vue'

/**
 *
 * @param importPath import return result
 * @param module
 * @returns {{new(): ComponentPublicInstance}}
 */
export function createAsyncComponent(importPath, module = null) {
    if (!module) {
        return defineAsyncComponent(() => importPath)
    }
    return defineAsyncComponent(async () => (await importPath)[module]
    )
}
