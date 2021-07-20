"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDocumentSignal = exports.signalDocument = exports.isDocumentSignalled = exports.DOCUMENT_SIGNAL_JSON_PATCH = exports.DOCUMENT_SIGNAL = void 0;
exports.DOCUMENT_SIGNAL = 'system.codezero.io/update-signal';
exports.DOCUMENT_SIGNAL_JSON_PATCH = 'system.codezero.io~1update-signal';
const isDocumentSignalled = (document) => { var _a, _b; return ((_b = (_a = document.metadata) === null || _a === void 0 ? void 0 : _a.annotations) === null || _b === void 0 ? void 0 : _b[exports.DOCUMENT_SIGNAL]) === 'true'; };
exports.isDocumentSignalled = isDocumentSignalled;
const signalDocument = (document) => {
    if (!document.metadata)
        document.metadata = { annotations: { [exports.DOCUMENT_SIGNAL]: 'true' } };
    else if (!document.metadata.annotations)
        document.metadata.annotations = { [exports.DOCUMENT_SIGNAL]: 'true' };
    else
        document.metadata.annotations[exports.DOCUMENT_SIGNAL] = 'true';
};
exports.signalDocument = signalDocument;
const clearDocumentSignal = (document) => { var _a, _b; return (_b = (_a = document.metadata) === null || _a === void 0 ? void 0 : _a.annotations) === null || _b === void 0 ? true : delete _b[exports.DOCUMENT_SIGNAL]; };
exports.clearDocumentSignal = clearDocumentSignal;
//# sourceMappingURL=signal.js.map