"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createValidateMixin = void 0;
const tslib_1 = require("tslib");
const createValidateMixin = (base) => class extends base {
    constructor() {
        super(...arguments);
        this.hubToClusterMap = {
            'https://develop.codezero.io': 'codezero.dev',
            'https://staging.codezero.io': 'codezero.dev',
            'https://codezero.io': 'codezero.cloud'
        };
        this.hubToFeatureKeyMap = {
            'https://develop.codezero.io': '2esfjsm95kkj0c8nc7rrlh320c7omri0hu1s',
            'https://staging.codezero.io': 'b510uri5ep25aspo5u8pi94nv3fdgffkhen9',
            'https://codezero.io': 'p2h2meb6rh5d9ac16nskh62ee1h6gs2thnv1'
        };
        this.hubToStripeKeyMap = {
            'https://develop.codezero.io': 'pk_test_51HXVWKKjz7Cmz2tekhX1kNx5BZXiKn0j4ROatZMROTwHDOwJPl6bnTNsH1DIqxde90FkzTCi9Ix6x5aQxhCuLr7D00tcbfVwNC',
            'https://staging.codezero.io': 'pk_test_51HXVWKKjz7Cmz2tekhX1kNx5BZXiKn0j4ROatZMROTwHDOwJPl6bnTNsH1DIqxde90FkzTCi9Ix6x5aQxhCuLr7D00tcbfVwNC',
            'https://codezero.io': 'pk_live_51HXVWKKjz7Cmz2te0QAP3Z3361Wmpia5EyYBY4CRSM61XrPqEOX4kIg7AWmKTAGeHGxyG9KTGANo94HJvACIibpc00pwdf0L1W'
        };
        this.hubToCluster = (hubURL) => {
            if (hubURL.endsWith('ngrok.io'))
                return 'codezero.dev';
            return this.hubToClusterMap[hubURL] || 'codezero.cloud';
        };
        this.hubToFlagKey = (hubURL) => {
            if (hubURL.endsWith('ngrok.io'))
                return '2esfjsm95kkj0c8nc7rrlh320c7omri0hu1s';
            return this.hubToFeatureKeyMap[hubURL] || 'p2h2meb6rh5d9ac16nskh62ee1h6gs2thnv1';
        };
        this.hubToStripeKey = (hubURL) => {
            if (hubURL.endsWith('ngrok.io'))
                return 'pk_test_51HXVWKKjz7Cmz2tekhX1kNx5BZXiKn0j4ROatZMROTwHDOwJPl6bnTNsH1DIqxde90FkzTCi9Ix6x5aQxhCuLr7D00tcbfVwNC';
            return this.hubToStripeKeyMap[hubURL] || 'pk_live_51HXVWKKjz7Cmz2te0QAP3Z3361Wmpia5EyYBY4CRSM61XrPqEOX4kIg7AWmKTAGeHGxyG9KTGANo94HJvACIibpc00pwdf0L1W';
        };
    }
    createValidate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { protocol, clusterId, clusterKey, clusterNamespace, tag, hubServerURL } = this.spec;
            if (!clusterId)
                throw new Error('Cluster Id is required');
            if (!clusterNamespace)
                throw new Error('Cluster Namespace is required');
            if (!hubServerURL)
                throw new Error('Hub Server URL is required');
            if (!clusterKey)
                throw new Error('Cluster key is required');
            if (!protocol)
                this.spec.protocol = 'https';
            if (!tag)
                this.spec.tag = 'latest';
            if (!this.spec.clusterDomain)
                this.spec.clusterDomain = this.hubToCluster(this.spec.hubServerURL);
            this.spec.featureAuthKey = this.hubToFlagKey(this.spec.hubServerURL);
            this.spec.stripePublishableKey = this.hubToStripeKey(this.spec.hubServerURL);
        });
    }
};
exports.createValidateMixin = createValidateMixin;
//# sourceMappingURL=createValidate.js.map