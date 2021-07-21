import { HubClient } from '@c6o/common'
import { AuthPerformer } from '../auth/base'

export const getHubClient = () => {
    const auth = new AuthPerformer()
    const hubClient = new HubClient()
    hubClient.tokenPromise = auth.getToken()
    return hubClient
}