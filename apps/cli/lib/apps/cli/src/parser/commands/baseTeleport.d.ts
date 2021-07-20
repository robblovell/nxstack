import { BaseCommand } from '../base';
import { TeleportParams } from '../../orchestrators';
import { flags } from '@oclif/command';
import { WorkloadKinds } from '@provisioner/common';
export declare abstract class BaseTeleportCommand extends BaseCommand<TeleportParams> {
    static flags: {
        file: flags.IOptionFlag<string>;
        output: flags.IOptionFlag<string>;
        clean: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        wait: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        namespace: flags.IOptionFlag<string[]>;
        kubeconfig: flags.IOptionFlag<string[]>;
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        demo: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-input': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        quiet: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    flagMaps: {
        file: string;
        'dry-run': string;
        'no-input': string;
    };
    static args: {
        name: string;
        description: string;
    }[];
    workloadKind: WorkloadKinds;
    go(): Promise<void>;
}
