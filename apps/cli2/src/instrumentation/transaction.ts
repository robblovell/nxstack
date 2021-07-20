import * as Sentry from '@sentry/node'

export const startMetricsTransaction = async (name) => {
    if (process.env.CZ_ENV === 'development')
        return
    return await Sentry.startTransaction({ name })
}

export const endMetricsTransaction = async (transaction) => {
    if (process.env.CZ_ENV === 'development')
        return
    await transaction?.finish()
}