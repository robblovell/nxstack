import { PerformerParams } from '../base';
import { AppPerformer } from './base';
export interface AppPublishParams extends PerformerParams {
    account?: string;
    forgive?: boolean;
    manifest: string;
    manifestFile?: any;
    accountRecord?: any;
}
export declare class AppPublishPerformer extends AppPerformer<AppPublishParams> {
    ensure(): Promise<void>;
    perform(): Promise<void>;
    ensureManifestFile(): void;
    ensureAccountRecord(): Promise<void>;
    getManifests(): Generator<any, void, unknown>;
    publishManifest(manifestFile: any): Promise<void>;
}
