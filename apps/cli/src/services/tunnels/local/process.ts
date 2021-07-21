import path from 'path'
import detect from 'detect-port'
import { projectBaseDir } from '../../base'
import { ExternalService } from '../../session'
import { getClient } from './client'
import { attempt } from '@c6o/common'

const pathToChild = path.resolve(projectBaseDir, 'node_modules/ngrok/bin/ngrok')
export class NgrokProcess extends ExternalService {
    get signature() { return 'local-tunnel-ngrok '}


    async sessionInProgress() {
        return false // You can call this service as many times as you like
    }

    protected cleanUpMessage(hasDependant: boolean) {
        return hasDependant ?
            'Leaving local tunnel worker process untouched' :
            'Closing local tunnel worker process'
    }

    async performBackground() {
        const ngrokPID = await this.session.get<number>('child-pid')
        if (ngrokPID) return

        if (await detect(4040) !== 4040)
            throw new Error('Unable to start tunnel as port 4040 is occupied')

        const msg = 'Starting tunnel worker process'
        await this.wrapStatus(msg, super.spawner(pathToChild, false, 'start', '--none', '--log=stdout'))

        await attempt(25, 400, async () => !!await getClient())
    }
}