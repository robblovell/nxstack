import { BaseCommand } from '../base';
import { InitParams } from '../../services/params';
export declare class InitCommand extends BaseCommand<InitParams> {
    static description: string;
    static examples: string[];
    static flags: {
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        demo: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-input': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        quiet: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    flagMaps: {
        'dry-run': string;
        'no-input': string;
    };
    static args: any[];
    go(): Promise<void>;
}
