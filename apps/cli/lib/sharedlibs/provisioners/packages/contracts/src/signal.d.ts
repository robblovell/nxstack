import { Resource } from '@c6o/kubeclient-contracts';
export declare const DOCUMENT_SIGNAL = "system.codezero.io/update-signal";
export declare const DOCUMENT_SIGNAL_JSON_PATCH = "system.codezero.io~1update-signal";
export declare const isDocumentSignalled: (document: Partial<Resource>) => boolean;
export declare const signalDocument: (document: Partial<Resource>) => void;
export declare const clearDocumentSignal: (document: Partial<Resource>) => boolean;
