import open from 'open'
import { HTTPServer } from '../httpServer'
import { PerformerParams } from '../base'
import { AuthPerformer } from './base'

const hubURL = process.env.HUB_LOGIN_URL || process.env.HUB_SERVER_URL || 'http://localhost:1234'

export interface AuthLoginParams extends PerformerParams {
    token?: string
    yes?: boolean
}

export class AuthLoginPerformer extends AuthPerformer<AuthLoginParams> {

    server: HTTPServer

    whenYes = (params) => {
        if (params.token) return false
        return this.hasValidToken() && !params.yes
    }

    async perform(): Promise<void> {
        const responses = await super.prompt({
            name: 'yes',
            message: 'You are already logged in. Log out current user?',
            type: 'confirm',
            default: false,
            when: this.whenYes,
        }, this.params)

        if (!responses.yes) return
        if (responses.dryRun) return

        if (this.params.token) {
            await this.setToken(this.params.token)
            return
        }

        await this.login()
    }

    async login() {
        this.server = new HTTPServer()
        this.server.start(2222, this.loginServerCallback)

        if (process.env.NODE_ENV === 'development')
            await open(`${hubURL}?login=cli`)
        else
            await open('https://codezero.io?login=cli')

        this.status?.info('Waiting for credentials. Please continue in your web browser. Use the --token option if you are on a headless machine.')
        return this.server.serverPromise
    }

    loginServerCallback = async (req, res) => {
        try {
            const url = req
            const token = req.url.slice('/?access_token='.length, url.length)
            if (token?.length) {
                await this.setToken(token)
                this.status?.info('You are logged in. You may close the browser window now. Thank you.')
                res.end('You may close this window now. Thank you.')
            } else {
                this.status?.info('Something went wrong. Unable to retrieve token.')
                res.end('Something went wrong. Unable to retrieve token.')
            }
        } catch(ex) {
            this.status?.error(ex, 'HTTP Server failed to do whatever')
        } finally {
            this.server.stop()
        }
    }
}