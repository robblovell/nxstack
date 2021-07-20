import { Namespace } from '@c6o/kubeclient-resources/lib/core/v1'
import { ResourceId } from '@c6o/kubeclient-contracts'
import { WorkloadKinds } from '@provisioner/common'
import { OrchestratorParams } from '../../orchestrators'
import { ServiceParams } from '../base'
import { EnvMonitorParams } from '../monitors'
import { NamespaceParams } from './kubernetes'

export type TeleportWorkloadKind = 'Namespace' | WorkloadKinds

export interface TeleportParams extends
    ServiceParams,
    OrchestratorParams,
    NamespaceParams,
    EnvMonitorParams
// TODO: ShellerParams
{
    namespaceResourceId?: ResourceId<Namespace>
}
