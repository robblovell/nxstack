import { Questions } from './contracts';
import { TerminalUIParams } from './params';
import { DisplayClass, Reporter } from './display';
declare type questionsType<P> = Questions<P> | Promise<Questions<P>>;
export declare class TerminalUI<P extends TerminalUIParams = TerminalUIParams> {
    protected params?: P;
    readonly reporter: Reporter;
    constructor(params?: P);
    prompt(...questions: Array<questionsType<P> | void>): Promise<P>;
    list<K extends P[keyof P]>(items: K[], displayField: keyof K, header?: string, displayClass?: DisplayClass): void;
    listStrings(items: string[], header?: string, displayClass?: DisplayClass): void;
    confirm(message: string, defaultValue?: boolean): Promise<boolean>;
    selectOne<K extends P[keyof P]>(items: K[], message: string, resultField: keyof P, displayField: keyof K): Promise<any>;
}
export {};
