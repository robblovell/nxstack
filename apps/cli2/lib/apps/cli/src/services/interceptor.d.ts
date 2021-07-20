import { InterceptorParams } from './params';
import { CompositeService, SessionDescription } from './session';
export declare class Interceptor extends CompositeService<InterceptorParams> {
    toDescription(): Promise<SessionDescription<InterceptorParams>>;
    protected execute(): Promise<void>;
}
