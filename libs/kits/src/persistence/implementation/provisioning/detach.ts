import { workerData, isMainThread } from 'worker_threads'
import { Persistence } from '../../helper'
import { DetachRequest } from '@provisioner/contracts'

async function main(request: DetachRequest) {
    const persistence = new Persistence()
    await (persistence as any).detachDestructiveImplementation(request)
}

// This file runs in a background worker. debug statements don't work!
// See: https://medium.com/@Trott/using-worker-threads-in-node-js-80494136dbb6

// exit event is not sent if we don't call exit()
if (!isMainThread) {
    main(workerData).then(_ => process.exit())
}

export const detachWorker = main