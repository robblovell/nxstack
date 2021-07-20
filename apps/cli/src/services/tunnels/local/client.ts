import { NgrokClient } from '@c6o/common'
import { createDebug } from '@c6o/logger'

const debug = createDebug()

export const getClient = async () => {
    try {
        const client = new NgrokClient()

        if (!await client.isReady())
            throw new Error('Tunnel client is not ready.')
        return client
    }
    catch(ex) {
        debug('No client %o', ex)
        return null
    }
}
