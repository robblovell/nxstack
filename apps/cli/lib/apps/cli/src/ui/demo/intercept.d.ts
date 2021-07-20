import { Demo } from './base';
import { InterceptorParams } from '../../services';
export declare class InterceptDemo<T extends InterceptorParams = InterceptorParams> extends Demo<T> {
    demo(): Promise<void>;
}
