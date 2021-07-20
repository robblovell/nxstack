import { flags } from '@oclif/command';
import { AuthLoginParams } from '../../../performers/auth/login';
import { BaseCommand } from '../../base';
export declare class AuthLogin extends BaseCommand<AuthLoginParams> {
    static hidden: boolean;
    static description: string;
    static flags: {
        token: flags.IOptionFlag<string>;
        yes: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        demo: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-input': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        quiet: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    go(): Promise<void>;
}
