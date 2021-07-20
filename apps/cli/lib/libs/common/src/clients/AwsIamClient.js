"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsIamClient = void 0;
const tslib_1 = require("tslib");
const aws4 = tslib_1.__importStar(require("aws4"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const debug = debug_1.default('common:clients:AwsIamClient');
class AwsIamClient {
    constructor() {
        this.apiVersion = '2010-05-08';
        this.apiURL = () => { return 'https://iam.amazonaws.com'; };
        this.sendRequest = (action, params) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const opts = {
                host: new URL(this.apiURL()).host,
                method: 'GET',
                url: `${this.apiURL()}`,
                path: `/?Version=${this.apiVersion}&Action=${action}`,
                service: 'iam',
                params: Object.assign({ Version: this.apiVersion, Action: action }, params),
            };
            if (params) {
                for (const key of Object.keys(params))
                    opts.path += `&${key}=${params[key]}`;
            }
            const signedRequest = aws4.sign(opts, {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            });
            delete signedRequest.headers['Host'];
            delete signedRequest.headers['Content-Length'];
            return yield axios_1.default(signedRequest);
        });
        this.getRoles = (roleType) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const response = yield this.sendRequest('ListRoles');
            return (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.ListRolesResponse) === null || _b === void 0 ? void 0 : _b.ListRolesResult) === null || _c === void 0 ? void 0 : _c.Roles) === null || _d === void 0 ? void 0 : _d.filter(item => { var _a, _b; return item.Path === '/' && ((_b = (_a = JSON.parse(decodeURIComponent(item.AssumeRolePolicyDocument))) === null || _a === void 0 ? void 0 : _a.Statement) === null || _b === void 0 ? void 0 : _b.some(subItem => { var _a; return ((_a = subItem.Principal) === null || _a === void 0 ? void 0 : _a.Service) === `${roleType}.amazonaws.com`; })); });
        });
        this.createRole = (roleName, spec) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _e, _f, _g;
            const response = yield this.sendRequest('CreateRole', {
                'RoleName': roleName,
                'Path': '/',
                'AssumeRolePolicyDocument': JSON.stringify(spec)
            });
            return (_g = (_f = (_e = response.data) === null || _e === void 0 ? void 0 : _e.CreateRoleResponse) === null || _f === void 0 ? void 0 : _f.CreateRoleResult) === null || _g === void 0 ? void 0 : _g.Role;
        });
        this.getRoleAttachedPolicies = (roleName) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _h, _j, _k, _l;
            const response = yield this.sendRequest('ListAttachedRolePolicies', {
                'RoleName': roleName
            });
            return (_l = (_k = (_j = (_h = response.data) === null || _h === void 0 ? void 0 : _h.ListAttachedRolePoliciesResponse) === null || _j === void 0 ? void 0 : _j.ListAttachedRolePoliciesResult) === null || _k === void 0 ? void 0 : _k.AttachedPolicies) === null || _l === void 0 ? void 0 : _l.map(item => item.PolicyArn);
        });
        this.attachRolePolicy = (roleName, policyArn) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _m, _o, _p, _q;
            const response = yield this.sendRequest('AttachRolePolicy', {
                'RoleName': roleName,
                'PolicyArn': policyArn
            });
            return (_q = (_p = (_o = (_m = response.data) === null || _m === void 0 ? void 0 : _m.ListAttachedRolePoliciesResponse) === null || _o === void 0 ? void 0 : _o.ListAttachedRolePoliciesResult) === null || _p === void 0 ? void 0 : _p.AttachedPolicies) === null || _q === void 0 ? void 0 : _q.map(item => item.PolicyArn);
        });
        this.getCustomPolicies = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _r, _s, _t;
            const response = yield this.sendRequest('ListPolicies', {
                'Scope': 'Local'
            });
            return (_t = (_s = (_r = response.data) === null || _r === void 0 ? void 0 : _r.ListPoliciesResponse) === null || _s === void 0 ? void 0 : _s.ListPoliciesResult) === null || _t === void 0 ? void 0 : _t.Policies;
        });
        this.createPolicy = (policyName, spec) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            var _u, _v, _w;
            const response = yield this.sendRequest('CreatePolicy', {
                'PolicyName': policyName,
                'PolicyDocument': JSON.stringify(spec)
            });
            return (_w = (_v = (_u = response.data) === null || _u === void 0 ? void 0 : _u.CreatePolicyResponse) === null || _v === void 0 ? void 0 : _v.CreatePolicyResult) === null || _w === void 0 ? void 0 : _w.Policy;
        });
        this.eksClusterInlinePolicy = () => ({
            Version: '2012-10-17',
            Statement: [{
                    Effect: 'Allow',
                    Principal: {
                        Service: 'eks.amazonaws.com'
                    },
                    Action: 'sts:AssumeRole'
                }]
        });
        this.ec2NodeGroupInlinePolicy = () => ({
            Version: '2012-10-17',
            Statement: [{
                    Effect: 'Allow',
                    Principal: {
                        Service: 'ec2.amazonaws.com'
                    },
                    Action: 'sts:AssumeRole'
                }]
        });
        this.eksCustomPolicy = () => ({
            Version: '2012-10-17',
            Statement: [{
                    Effect: 'Allow',
                    Action: [
                        'eks:*'
                    ],
                    Resource: '*'
                },
                {
                    Effect: 'Allow',
                    Action: 'iam:PassRole',
                    Resource: '*',
                    Condition: {
                        StringEquals: {
                            'iam:PassedToService': 'eks.amazonaws.com'
                        }
                    }
                }]
        });
        this.getCustomPolicy = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const policies = yield this.getCustomPolicies();
            let codeZeroEksPolicy = policies === null || policies === void 0 ? void 0 : policies.find(item => item.PolicyName === 'CodeZeroEksPolicy');
            if (!codeZeroEksPolicy) {
                debug('Creating CodeZeroEksPolicy');
                codeZeroEksPolicy = yield this.createPolicy('CodeZeroEksPolicy', this.eksCustomPolicy());
            }
            return codeZeroEksPolicy;
        });
        this.getClusterRole = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const clusterRoles = yield this.getRoles('eks');
            let codeZeroClusterRole = clusterRoles === null || clusterRoles === void 0 ? void 0 : clusterRoles.find(item => item.RoleName === 'CodeZeroClusterRole');
            if (!codeZeroClusterRole) {
                debug('Creating CodeZeroClusterRole');
                codeZeroClusterRole = yield this.createRole('CodeZeroClusterRole', this.eksClusterInlinePolicy());
            }
            debug('Attaching policies to CodeZeroClusterRole');
            yield this.attachRolePolicy('CodeZeroClusterRole', (yield this.getCustomPolicy()).Arn);
            yield this.attachRolePolicy('CodeZeroClusterRole', 'arn:aws:iam::aws:policy/AmazonEKSClusterPolicy');
            return codeZeroClusterRole;
        });
        this.getNodeRole = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const nodeRoles = yield this.getRoles('ec2');
            let codeZeroNodeRole = nodeRoles === null || nodeRoles === void 0 ? void 0 : nodeRoles.find(item => item.RoleName === 'CodeZeroNodeRole');
            if (!codeZeroNodeRole) {
                debug('Creating CodeZeroNodeRole');
                codeZeroNodeRole = yield this.createRole('CodeZeroNodeRole', this.ec2NodeGroupInlinePolicy());
            }
            debug('Attaching policies to CodeZeroNodeRole');
            yield this.attachRolePolicy('CodeZeroNodeRole', (yield this.getCustomPolicy()).Arn);
            yield this.attachRolePolicy('CodeZeroNodeRole', 'arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy');
            yield this.attachRolePolicy('CodeZeroNodeRole', 'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly');
            yield this.attachRolePolicy('CodeZeroNodeRole', 'arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy');
            return codeZeroNodeRole;
        });
    }
    init(accessKeyId, secretAccessKey) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.accessKeyId = accessKeyId;
            this.secretAccessKey = secretAccessKey;
        });
    }
}
exports.AwsIamClient = AwsIamClient;
//# sourceMappingURL=AwsIamClient.js.map