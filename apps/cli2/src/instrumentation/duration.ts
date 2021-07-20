import * as Sentry from '@sentry/node'
import { Session, SessionParams } from '../services'
import { createDebug } from '@c6o/logger'
const debug = createDebug('Metrics')

export const recordMetricsDuration = async (session: Session, params: SessionParams, displayName?: string) => {
    if (process.env.CZ_ENV === 'development')
        return
    if (params.clean) { // this is the end of a session, log the duration to sentry
        const started: string = await session.get('timestamp')
        if (started) {
            const sessionDisplayName: string = await session.get('displayName')
            const name: string = displayName || sessionDisplayName || session.signature
            const duration = (new Date() as any) - (new Date(started) as any) // in ms
            debug('DURATION (Seconds): ', duration/1000)
            debug('Transaction Name: ', name)
            const transaction = await Sentry.startTransaction({
                op: 'duration',
                name,
                //@ts-ignore
                startTimestamp: new Date(started).toISOString()
            })
            //@ts-ignore
            await transaction.finish(new Date().toISOString())
        }
    } else { // This is the start of the session, set the session timestamp.
        await session.set('timestamp', new Date().toISOString())
        if (displayName) {
            debug('Transaction Name Given: ', displayName)
            await session.set('displayName', displayName)
        }
    }
}
