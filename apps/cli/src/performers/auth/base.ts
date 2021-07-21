import { promises as fs } from 'fs'
import os from 'os'
import createDebug from 'debug'
import { Performer, PerformerParams } from '../base'

const debug = createDebug('@c6o/cli:utils')

const SERVICE = 'codezero-cli'
const USERNAME = 'token'
const TOKEN_FILE ='.czctlrc'

export class AuthPerformer<T extends PerformerParams = PerformerParams> extends Performer<T> {

    get filepath() {return os.homedir() + '/' + TOKEN_FILE}

    async getConfig() {
        try {
            const content = await fs.readFile(this.filepath)
            return JSON.parse(content.toString())
        } catch (e) {
            debug('ERROR', e)
            return {} // caller will continue and assume an object has been returned.
        }
}

    async saveConfig(config) {
        debug('writing to file', this.filepath)
        debug(JSON.stringify(config))
        return fs.writeFile(this.filepath, JSON.stringify(config))
    }

    async setToken(token) {
        try {
            const keytar = await import('keytar')
            await keytar.setPassword(SERVICE, USERNAME, token)
            debug('System keyring set.')
        } catch (e) {
            // Failed to access system keyring.  Falling back on file based tokens.
            debug('Warning: system keyring is unavailable.  Storing credentials on filesystem.')

            const config = await this.getConfig()
            config.auth = {
                token
            }
            await this.saveConfig(config)
        }
    }

    async hasValidToken() {
        const token = await this.getToken()
        return token && token !== 'invalid'
    }

    async getToken() {
        try {
            const keytar = await import('keytar')
            debug('Retrieved keytar token')
            return await keytar.getPassword(SERVICE, USERNAME)
        } catch (e) {
            // Failed to access system keyring.  Falling back on file based tokens.
            debug('Error getting password with keytar, trying files based token...')
            try {
                const config = await this.getConfig()
                debug('Retrieved token from file')
                return config?.auth?.token
            } catch (e) {
                debug('Failed to get file based token, throwing error.')
                throw new Error('Failed to get token.')
            }
        }
    }
}