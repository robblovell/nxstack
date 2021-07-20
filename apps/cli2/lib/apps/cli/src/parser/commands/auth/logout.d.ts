import { BaseCommand } from '../../base';
export declare class AuthLogout extends BaseCommand {
    static hidden: boolean;
    static description: string;
    go(): Promise<void>;
}
