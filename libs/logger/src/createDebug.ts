import { caller } from './caller'
import debugLib from 'debug'

export function createDebug (aSubModule?: string) {
    try {
        const info = caller()
        return aSubModule ?
            debugLib(aSubModule + info.module) :
            debugLib(info.module)
    } catch {
        return debugLib(aSubModule || 'unknown')
    }
}

export const debug = createDebug()
