import { HubClient } from '@c6o/common';
import { Performer, PerformerParams } from '../base';
export declare class AppPerformer<T extends PerformerParams = PerformerParams> extends Performer<T> {
    _hubClient: HubClient;
    get hubClient(): HubClient;
}
