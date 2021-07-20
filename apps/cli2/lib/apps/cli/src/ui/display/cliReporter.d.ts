import chalk from 'chalk';
import { Table } from 'cli-ux';
import { DisplayClass, Reporter, ReporterOptions, PrintOptions } from './contracts';
export declare class CLIReporter implements Reporter {
    protected options: ReporterOptions;
    protected printOut: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    protected errorOut: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    SEA: string;
    FIRE: string;
    OCEAN: string;
    GRASS: string;
    SUN: string;
    colors: {
        fire: string;
        ocean: string;
        reset: string;
        sea: string;
    };
    bkg: {
        error: chalk.Chalk;
        highlight: chalk.Chalk;
        subtle: chalk.Chalk;
        success: chalk.Chalk;
        warn: chalk.Chalk;
    };
    msg: {
        error: chalk.Chalk;
        highlight: chalk.Chalk;
        important: chalk.Chalk;
        subtle: chalk.Chalk;
        success: chalk.Chalk;
        warn: chalk.Chalk;
    };
    bannerPreamble: string;
    bannerConclusion: string;
    constructor(options: ReporterOptions, printOut?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    }, errorOut?: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    });
    formatMessage(msg: string, displayClass?: DisplayClass): string;
    reduceMessages(messages: string | string[], prefix?: string): string;
    print(message: string | string[], displayClass?: DisplayClass, displayOptions?: PrintOptions): void;
    default(message: string | string[], displayOptions?: PrintOptions): void;
    error(message: string | string[], displayOptions?: PrintOptions): void;
    highlight(message: string | string[], displayOptions?: PrintOptions): void;
    success(message: string | string[], displayOptions?: PrintOptions): void;
    warn(message: string | string[], displayOptions?: PrintOptions): void;
    banner(title: string, messages: string | string[], displayClass?: DisplayClass): void;
    url(text: string, link: string, pre?: string): void;
    table(data: any[], inputOptions?: Partial<Table.TableOptions>): void;
    newline(lineCount?: number): void;
}
