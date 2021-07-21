import { ClusterSessionParams } from '../params'
import { SessionService } from './service'
import { Session } from './session'
import { ClusterSessionStorage } from './storage/cluster'
import * as os from 'os'
import { machineId } from 'node-machine-id'


export abstract class ClusterSessionService<P extends ClusterSessionParams> extends SessionService<P> {

    async sessionUserId() {
        const mid = await machineId(true)
        return `${os.userInfo().username}-${mid}`
    }

    async ensureSession() {
        if (this.session) return
        this.session = new Session(this.signature, new ClusterSessionStorage(this.signature, this.params))
        await this.session.lock()
    }
}