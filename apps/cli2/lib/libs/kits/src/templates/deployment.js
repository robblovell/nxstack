"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPodTemplate = exports.getDeploymentTemplate = void 0;
function getDeploymentTemplate(name, namespace, image, labels, tag, imagePullPolicy, command) {
    imagePullPolicy = imagePullPolicy || tag === 'latest ' ? 'Always' : 'IfNotPresent';
    image = tag && !image.includes(':') ? `${image}:${tag}` : image;
    return {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
            namespace: namespace,
            name: name,
            labels
        },
        spec: {
            selector: {
                matchLabels: {
                    app: name
                }
            },
            template: {
                metadata: {
                    labels
                },
                spec: {
                    securityContext: {
                        fsGroup: 1000,
                    },
                    containers: [{
                            name,
                            image,
                            imagePullPolicy,
                            command
                        }]
                }
            }
        }
    };
}
exports.getDeploymentTemplate = getDeploymentTemplate;
const getPodTemplate = (name, namespace) => ({
    kind: 'Pod',
    metadata: {
        namespace,
        labels: {
            app: name
        }
    }
});
exports.getPodTemplate = getPodTemplate;
//# sourceMappingURL=deployment.js.map