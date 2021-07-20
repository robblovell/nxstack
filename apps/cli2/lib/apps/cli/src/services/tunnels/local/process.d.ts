import { ExternalService } from '../../session';
export declare class NgrokProcess extends ExternalService {
    get signature(): string;
    sessionInProgress(): Promise<boolean>;
    protected cleanUpMessage(hasDependant: boolean): "Leaving local tunnel worker process untouched" | "Closing local tunnel worker process";
    performBackground(): Promise<void>;
}
