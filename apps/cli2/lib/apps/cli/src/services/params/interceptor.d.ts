import { OrchestratorParams } from '../../orchestrators';
import { TerminalUIParams } from '../../ui';
import { ServiceParams } from '../base';
import { ServiceProxyParams } from '../proxies/params';
import { LocalTunnelParams } from '../tunnels/';
import { ResourceId } from '@c6o/kubeclient-contracts';
import { Namespace } from '@c6o/kubeclient-resources/lib/core/v1';
export interface InterceptorParams extends ServiceParams, TerminalUIParams, OrchestratorParams, ServiceProxyParams, LocalTunnelParams {
    namespaceResourceId?: ResourceId<Namespace>;
}
