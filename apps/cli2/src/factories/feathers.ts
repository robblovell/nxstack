import { FeathersServiceFactory } from '@c6o/common'

export const getFeathers = () => {
    if (!process.env.SYSTEM_SERVER_URL)
        throw Error('SYSTEM_SERVER_URL is not defined')

    const feathersFactory = new FeathersServiceFactory()
    feathersFactory.url = process.env.SYSTEM_SERVER_URL
    //feathersFactory.storageKey = 'c6o-cli'
    return feathersFactory
}
