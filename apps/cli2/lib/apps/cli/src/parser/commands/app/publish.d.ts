import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export declare class AppPublish extends BaseCommand {
    static hidden: boolean;
    static description: string;
    static examples: string[];
    static flags: {
        account: flags.IOptionFlag<string>;
        forgive: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        demo: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-input': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        quiet: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: {
        name: string;
        required: boolean;
        description: string;
    }[];
    go(): Promise<void>;
}
