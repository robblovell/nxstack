import { BaseClient } from './BaseClient'
import { attempt } from '../utils/attempt'

export class NgrokClient extends BaseClient {
    get apiURL() {
        return 'http://localhost:4040/api'
    }

    async getTunnels() {
        const res = await this.get('tunnels')
        return this.toData(res)
    }

    async isReady(): Promise<boolean> {
        const params = {
            addr: 1025,
            proto: 'http',
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            bind_tls: false,
            name: 'isReadyTest'
        }
        try {
            await attempt(25, 200, async () => !!await this.createTunnel(params))
            return true
        }
        catch (ex) {
            return false
        }
        finally {
            await this.deleteTunnel(params.name)
        }
    }

    async createTunnel(data) {
        const res = await this.post('tunnels', data)
        return this.toData(res)
    }

    async deleteTunnel(name) {
        const res = await this.delete(`tunnels/${name}`)
        return this.toData(res)
    }

}