import * as os from 'os'
import * as Sentry from '@sentry/node'
import hash from 'object-hash'

if (process.env.CZ_ENV !== 'development') {
    Sentry.init({
        dsn: 'https://51013c81a32a424da4794ac3303f77b1@o820541.ingest.sentry.io/5809151',
        tracesSampleRate:  process.env.SENTRY_RATE ? parseInt(process.env.SENTRY_RATE) : 1.0,
        enabled: !process.env.NO_SENTRY,
        environment: process.env.CZ_ENV || 'production'
    })

    Sentry.setUser({
        id: hash(`${process.env.USER}-${process.env.HOST}`),
        host: os.hostname(),
        username: os.userInfo().username
    })
}

