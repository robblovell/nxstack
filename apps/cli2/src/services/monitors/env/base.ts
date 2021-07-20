import { createDebug } from '@c6o/logger'
import { promises as fs } from 'fs'
import { keyValue, Resource } from '@c6o/kubeclient-contracts'
import { Monitor } from '../base'
import { ensureOwner } from '../../session'
import { EnvMonitorParams } from './params'

const debug = createDebug()

export class EnvMonitor<R extends Resource> extends Monitor<R, EnvMonitorParams> {
    envValues: keyValue = { }

    async refresh() {
        if (!this.params.envFile) return

        let data = { }
        for(const monitor of this.each())
            data = { ...data, ...monitor.envValues }

        const envContent = await this.formatEnvContent(data)

        debug('env refreshed %s %o', this.key, envContent)

        await fs.writeFile(this.params.envFile, envContent, { encoding:'utf8', flag:'w' })
        await ensureOwner(this.params.envFile)
    }

    async formatEnvContent(data) {
        switch (this.params.format) {
            case 'json':
                return JSON.stringify(data, (key, value: any) => {
                    if (value.type === 'Buffer') {
                        return Buffer.from(value.data).toString()
                    }
                    return value
                }, 2)
                break
            case 'yaml':
                return Object.keys(data).reduce((acc, key) => {
                    acc += `${key}: ${data[key]}\n`
                    return acc
                }, '')
                break
            case 'env':
                return Object.keys(data).reduce((acc, key) => {
                    acc += `${key}=${data[key]}\n`
                    return acc
                }, '')
                break
            case 'sh':
            default:
                return Object.keys(data).reduce((acc, key) => {
                    acc += `export "${key}=${data[key]}"\n`
                    return acc
                }, '')
                break
        }
    }

    async stop() {
        debug('stopping %s', this.key)
        await super.stop()
        if (!this.parent)
            await fs.unlink(this.params.envFile)
    }
}
