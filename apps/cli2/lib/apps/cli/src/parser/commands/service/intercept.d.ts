import { flags } from '@oclif/command';
import { BaseCommand } from '../../base';
import { InterceptorParams } from '../../../services';
export declare class InterceptService extends BaseCommand<InterceptorParams> {
    static description: string;
    static examples: string[];
    static strict: boolean;
    static flags: {
        localPort: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        remotePort: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        all: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        header: flags.IOptionFlag<string>;
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
        service: string;
        port: string;
        'dry-run': string;
        'no-input': string;
    };
    static args: {
        name: string;
        description: string;
    }[];
    go(): Promise<void>;
}
