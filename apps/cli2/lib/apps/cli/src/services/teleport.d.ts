import { TeleportParams } from './params';
import { CompositeService, SessionDescription } from './session';
export declare class Teleport extends CompositeService<TeleportParams> {
    toDescription(): Promise<SessionDescription<TeleportParams>>;
    execute(): Promise<void>;
}
