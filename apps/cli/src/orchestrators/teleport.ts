import { DeploymentHelper, CronJobHelper, StatefulSetHelper, JobHelper, NamespaceHelper, PodHelper } from '@provisioner/contracts'
import { hasKubefwd, installKubefwd } from '@c6o/kubefwd'
import { Teleport as TeleportService, TeleportParams as TeleportServiceParams, TeleportWorkloadKind } from '../services'
import { Orchestrator } from './base'
import { Kubernetes, KubernetesResources } from './kubernetes'
import { Resource } from '@c6o/kubeclient-contracts'

export interface TeleportParams extends TeleportServiceParams {
     kind: TeleportWorkloadKind
     resourceName: string
}
export class Teleport extends Orchestrator<TeleportParams> {

    filteredNamespaces = ['c6o-seed', 'c6o-system', 'istio-system', 'kube-node-lease', 'kube-public', 'kube-system']

    async apply() {
        let templateFrom: (namespace?, name?) => Resource
        switch (this.params.kind) {
            case 'CronJob': templateFrom = CronJobHelper.template
                break
            case 'Deployment': templateFrom = DeploymentHelper.template
                break
            case 'Job': templateFrom = JobHelper.template
                break
            case 'Namespace': templateFrom = NamespaceHelper.template
                break
            case 'Pod': templateFrom = PodHelper.template
                break
            case 'StatefulSet': templateFrom = StatefulSetHelper.template
                break
        }

        this.params = await this.UI.prompt(
            // Make sure kubefwd is ready
            await this.ensureKubefwd(),
            // Make sure we have a cluster
            await Kubernetes.ensureCluster(this.params),
            // Make sure we have a namespace
            await KubernetesResources.ensureResourceId(
                this.params,
                NamespaceHelper.template,
                'namespace',
                'namespaceResourceId',
                'namespace',
                n => !this.filteredNamespaces.includes(n.metadata.name)
            ),

            // Only support deployments at this time
            // Will need a helper factory if we support more
            this.params.kind === 'Deployment' ? await KubernetesResources.ensureResourceId(
                this.params,
                templateFrom,
                'resourceName',
                'resourceQuery',
                'namespaceResourceId',
                n => !this.filteredNamespaces.includes(n.metadata.name)
            ) : undefined
        )
        // TODO: temporary settings until we set this properly
        this.params.namespace = this.params.namespaceResourceId.metadata.name

        const teleport = new TeleportService(this.params)
        await teleport.perform('Teleport')
    }

    async ensureKubefwd() {
        if (!await hasKubefwd()) {
            if (process.getuid() === 0) {
                // If running as root, we can finish setting things it up for the user
                await installKubefwd()
            } else {
                // Otherwise, they need to explicitly call czctl with sudo
                throw new Error('Teleport is not fully initialized yet.\nTry: \'sudo czctl init\'')
            }
        }
    }
}