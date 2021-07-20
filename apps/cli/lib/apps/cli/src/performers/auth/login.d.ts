import { HTTPServer } from '../httpServer';
import { PerformerParams } from '../base';
import { AuthPerformer } from './base';
export interface AuthLoginParams extends PerformerParams {
    token?: string;
    yes?: boolean;
}
export declare class AuthLoginPerformer extends AuthPerformer<AuthLoginParams> {
    server: HTTPServer;
    whenYes: (params: any) => boolean;
    perform(): Promise<void>;
    login(): Promise<any>;
    loginServerCallback: (req: any, res: any) => Promise<void>;
}
