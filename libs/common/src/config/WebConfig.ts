import { injectable } from 'inversify'
import { IConfig } from '../'

import createDebug from 'debug'
const debug = createDebug('common:config:web')

declare global {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Window { c6oEnv : any }
}

@injectable()
export class WebConfig implements IConfig {

    /* TODO: BEGIN - refactor out API lookup into a different config */
    get hubLoginURL() {
        return this.get('HUB_LOGIN_URL') || this.hubURL
    }

    get hubURL() {
        return this.get('HUB_SERVER_URL') || this.apiURL
    }

    _apiURL
    get apiURL() {
        if (this._apiURL) return this._apiURL

        // Cannot use process.env.NODE_ENV so we use the window location
        // to determine if we are in local development or in cluster
        if (window.location.hostname === 'localhost') {
            const port =
                // hub-web 1234 and hub-dockyard 1238 talk to hub-server:80 with teleport
                // Previously, with czdev hub, 1234 and 1238 talked to localhost:3030
                // the rest all talk to system-server on 3050
                window.location.port === '1234' || window.location.port === '1238' ?
                '80' : Number.parseInt(window.location.port) > 1300 ?
                    '80' :
                    '3050'
            // We're in development mode
            return this._apiURL = `http://hub-server:${port}`
        }

        return this._apiURL = ''
    }
    /* TODO: END */

    get envVars() {
        let win: Window = window
        while (win) {
            if (win.c6oEnv) {
                return win.c6oEnv
            }
            // note that JavaScript does NOT have win.parent === undefined at the top level
            // instead the win.parent equals the current window at the top level, which is not intuitive
            if (win === win.parent) {
                return undefined
            }
            win = win.parent
        }
    }

    init(config) {
        if (!config) return
        if (!window) throw Error('"window" not defined. WebConfig has to be used in a browser')
        if (window !== window.parent) throw Error('Attempt to initialize WebConfig in non-top level window')

        window.c6oEnv = {
            ...window.c6oEnv,
            ...config
        }
    }

    get<T = string>(key: string): T {
        try {
            return this.envVars?.[key]
        }
        catch(ex) { // TODO with the question mark above, this theoretically will never throw.
            debug(`ERROR ${ex}`)
        }
    }

    has = (key: string) => this.envVars?.[key] != undefined
    util = null
}
