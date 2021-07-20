import { Cluster } from '@c6o/kubeclient/client';
export declare const getKubeconfig: (params: any) => {
    kubestring: any;
    kubeconfig?: undefined;
} | {
    kubeconfig: string;
    kubestring?: undefined;
};
export declare const getCluster: (params: any) => Cluster;
