import { flags } from '@oclif/command';
import { SessionOrchestratorParams } from '../../../orchestrators';
import { BaseCommand } from '../../base';
export declare class ListSession extends BaseCommand<SessionOrchestratorParams> {
    static description: string;
    static examples: string[];
    static flags: {
        detail: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        kubeconfig: flags.IOptionFlag<string[]>;
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
    go(): Promise<void>;
}
