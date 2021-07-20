import Command from '@oclif/command';
import { CLIReporter } from '../ui/display';
import { Performer } from '../performers/base';
import { TerminalUIParams } from '../ui';
export declare type PerformerCreator<O> = new (signature: string) => Performer<O>;
export declare abstract class BaseCommand<P extends TerminalUIParams = TerminalUIParams> extends Command {
    reporter: CLIReporter;
    transaction: any;
    params: P;
    abstract go(): Promise<void>;
    static flags: {
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        demo: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-input': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        quiet: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static flagMaps: {
        'dry-run': string;
        'no-input': string;
    };
    flagMaps: {
        'dry-run': string;
        'no-input': string;
    };
    protected mapParams(source: any): P;
    protected getParams(): P;
    run(): Promise<void>;
    startMetricsTransaction(): Promise<void>;
    endMetricsTransaction(): Promise<void>;
    catch(err: any): Promise<void>;
    errorToMessage(err: any): string;
}
