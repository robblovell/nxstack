import { Logger } from './Logger'
import { injectable } from 'inversify'

@injectable()
export class SilentLogger implements Logger {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    debug() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    info() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    warn() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error() {}
}
