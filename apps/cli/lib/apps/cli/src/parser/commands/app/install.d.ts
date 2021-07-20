import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
export declare class AppInstall extends BaseCommand {
    static hidden: boolean;
    static description: string;
    static examples: string[];
    static flags: {
        registry: flags.IOptionFlag<string>;
        'spec-only': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        namespace: flags.IOptionFlag<string>;
        local: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        kubeconfig: flags.IOptionFlag<string[]>;
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        demo: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-input': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        quiet: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    flagMaps: {
        'spec-only': string;
        'dry-run': string;
        'no-input': string;
    };
    static args: {
        name: string;
        description: string;
    }[];
    go(): Promise<void>;
}
