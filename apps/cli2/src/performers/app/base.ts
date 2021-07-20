import { HubClient } from '@c6o/common'
import { getHubClient } from '../factories/hubClient'
import { Performer, PerformerParams } from '../base'

export class AppPerformer<T extends PerformerParams = PerformerParams> extends Performer<T> {

    _hubClient: HubClient
    get hubClient() {
        if (this._hubClient) return this._hubClient
        return this._hubClient = getHubClient()
    }
}
