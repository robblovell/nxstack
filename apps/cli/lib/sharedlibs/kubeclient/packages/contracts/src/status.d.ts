export declare type itemType = Stage | Event;
export declare type metaType = {
    [key: string]: string;
};
export declare class Event {
    is: string;
    id: string;
    stageId: string;
    exception: Error;
    timestamp: Date;
    type: 'info' | 'warn' | 'error';
    message: string;
    kind: string;
    namespace: string;
    name: string;
    version: string;
}
export declare class Stage {
    is: string;
    id: string;
    parentId?: string;
    depth: number;
    condition: 'running' | 'done' | 'skipped' | 'error';
    name: string;
    meta: metaType;
    startTime: Date;
    endTime: Date;
    latestEvent: any;
    begin(): void;
    end(): void;
    add(event: Event): void;
}
export declare class Status {
    condition: 'running' | 'done' | 'error';
    stages: Array<Stage>;
    currentStage: Stage;
    warnings: Array<Event>;
    errors: Array<Event>;
    findStage: (id: any) => Stage;
    newStage: () => Stage;
    mutated(...items: itemType[]): void;
    begin(): void;
    end(): void;
    push(stageName: string, stageIdOrMeta?: string | metaType, meta?: metaType): void;
    pop(skipped?: boolean): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(ex: Error, message?: string, ...args: any[]): void;
    addStage(stage: Stage): void;
    addEvent(event: Event): void;
    received(items: itemType[]): void;
}
