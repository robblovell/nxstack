import { Logger } from './Logger'
import { injectable } from 'inversify'
import createDebug from 'debug'

@injectable()
export class DebugLogger implements Logger {
    private _debug

    init(path) {
        this._debug = createDebug(path)
    }

    debug = (...args) => this._debug(...args)
    info = (...args) => this._debug(...args)
    warn = (...args) => this._debug(...args)
    error = (...args) => this._debug(...args)
}
