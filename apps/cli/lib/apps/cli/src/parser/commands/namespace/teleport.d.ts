import { BaseTeleportCommand } from '../baseTeleport';
import { WorkloadKinds } from '@provisioner/common';
export declare class NamespaceTeleport extends BaseTeleportCommand {
    static description: string;
    static examples: string[];
    static flags: {
        file: import("@oclif/command/lib/flags").IOptionFlag<string>;
        output: import("@oclif/command/lib/flags").IOptionFlag<string>;
        clean: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        wait: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        namespace: import("@oclif/command/lib/flags").IOptionFlag<string[]>;
        kubeconfig: import("@oclif/command/lib/flags").IOptionFlag<string[]>;
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        demo: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-input': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        quiet: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: {
        name: string;
        description: string;
    }[];
    workloadKind: WorkloadKinds;
}
