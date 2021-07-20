import { InitParams } from '../params';
import { Service } from '../base';
export declare class Init extends Service<InitParams> {
    execute(): Promise<void>;
    initKubefwd(): Promise<void>;
}
