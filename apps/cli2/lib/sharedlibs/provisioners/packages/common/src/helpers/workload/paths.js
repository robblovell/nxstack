"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathToSecretRefs = exports.pathToConfigMapRefs = exports.pathToEnv = exports.pathToContainers = void 0;
const pathToContainers = (kind) => {
    switch (kind) {
        case 'Pod':
            return '.spec.containers[*]';
        case 'Deployment':
        case 'StatefulSet':
        case 'Job':
            return '.spec.template.spec.containers[*]';
        case 'CronJob':
            return '.spec.jobTemplate.spec.template.spec.containers[*]';
    }
};
exports.pathToContainers = pathToContainers;
const pathToEnv = (kind) => `${exports.pathToContainers(kind)}.env[*]`;
exports.pathToEnv = pathToEnv;
const pathToConfigMapRefs = (kind) => `${exports.pathToContainers(kind)}.envFrom[*].configMapRef[*]`;
exports.pathToConfigMapRefs = pathToConfigMapRefs;
const pathToSecretRefs = (kind) => `${exports.pathToContainers(kind)}.envFrom[*].secretRef[*]`;
exports.pathToSecretRefs = pathToSecretRefs;
//# sourceMappingURL=paths.js.map