"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsEksClient = void 0;
const tslib_1 = require("tslib");
const errors_1 = require("@feathersjs/errors");
const crypto = tslib_1.__importStar(require("crypto-js"));
const aws4 = tslib_1.__importStar(require("aws4"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const utc_1 = tslib_1.__importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
class AwsEksClient {
    constructor() {
        this.isReady = false;
        this.apiURL = (regionCode) => { return `https://eks.${regionCode}.amazonaws.com`; };
        this.createCluster = (spec, regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const request = {
                host: new URL(this.apiURL(regionCode)).host,
                method: 'POST',
                url: `${this.apiURL(regionCode)}/clusters`,
                path: '/clusters',
                region: regionCode,
                service: 'eks',
                data: spec,
                body: JSON.stringify(spec),
                headers: {
                    'content-type': 'application/json'
                }
            };
            const signedRequest = aws4.sign(request, {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            });
            delete signedRequest.headers['Host'];
            delete signedRequest.headers['Content-Length'];
            return yield axios_1.default(signedRequest);
        });
        this.createNodeGroup = (clusterName, spec, regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const request = {
                host: new URL(this.apiURL(regionCode)).host,
                method: 'POST',
                url: `${this.apiURL(regionCode)}/clusters/${clusterName}/node-groups`,
                path: `/clusters/${clusterName}/node-groups`,
                region: regionCode,
                service: 'eks',
                data: spec,
                body: JSON.stringify(spec),
                headers: {
                    'content-type': 'application/json'
                }
            };
            const signedRequest = aws4.sign(request, {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            });
            delete signedRequest.headers['Host'];
            delete signedRequest.headers['Content-Length'];
            return yield axios_1.default(signedRequest);
        });
        this.deleteCluster = (name, regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const request = {
                host: new URL(this.apiURL(regionCode)).host,
                method: 'DELETE',
                url: `${this.apiURL(regionCode)}/clusters/${name}`,
                path: `/clusters/${name}`,
                region: regionCode,
                service: 'eks'
            };
            const signedRequest = aws4.sign(request, {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            });
            delete signedRequest.headers['Host'];
            delete signedRequest.headers['Content-Length'];
            return yield axios_1.default(signedRequest);
        });
        this.getClusters = (regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const request = {
                host: new URL(this.apiURL(regionCode)).host,
                method: 'GET',
                url: `${this.apiURL(regionCode)}/clusters`,
                path: '/clusters',
                region: regionCode,
                service: 'eks'
            };
            const signedRequest = aws4.sign(request, {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            });
            delete signedRequest.headers['Host'];
            delete signedRequest.headers['Content-Length'];
            return yield axios_1.default(signedRequest);
        });
        this.getCluster = (name, regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const request = {
                host: new URL(this.apiURL(regionCode)).host,
                method: 'GET',
                url: `${this.apiURL(regionCode)}/clusters/${name}`,
                path: `/clusters/${name}`,
                region: regionCode,
                service: 'eks'
            };
            const signedRequest = aws4.sign(request, {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            });
            delete signedRequest.headers['Host'];
            delete signedRequest.headers['Content-Length'];
            return yield axios_1.default(signedRequest);
        });
        this.getNodeGroups = (clusterName, regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const request = {
                host: new URL(this.apiURL(regionCode)).host,
                method: 'GET',
                url: `${this.apiURL(regionCode)}/clusters/${clusterName}/node-groups`,
                path: `/clusters/${clusterName}/node-groups`,
                region: regionCode,
                service: 'eks'
            };
            const signedRequest = aws4.sign(request, {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            });
            delete signedRequest.headers['Host'];
            delete signedRequest.headers['Content-Length'];
            return yield axios_1.default(signedRequest);
        });
        this.getNodeGroup = (clusterName, name, regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const request = {
                host: new URL(this.apiURL(regionCode)).host,
                method: 'GET',
                url: `${this.apiURL(regionCode)}/clusters/${clusterName}/node-groups/${name}`,
                path: `/clusters/${clusterName}/node-groups/${name}`,
                region: regionCode,
                service: 'eks'
            };
            const signedRequest = aws4.sign(request, {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            });
            delete signedRequest.headers['Host'];
            delete signedRequest.headers['Content-Length'];
            return yield axios_1.default(signedRequest);
        });
        this.waitForCluster = (name) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new errors_1.NotImplemented('');
        });
        this.kubeConfigTemplate = (clusterEndpoint, clusterCertificate, userToken) => {
            const spec = {
                apiVersion: 'v1',
                kind: 'Config',
                clusters: [{
                        cluster: { server: clusterEndpoint, 'certificate-authority-data': clusterCertificate },
                        name: 'kubernetes',
                    }],
                contexts: [{
                        context: { cluster: 'kubernetes', user: 'aws' },
                        name: 'ctx',
                    }],
                'current-context': 'ctx',
                preferences: {},
                users: [{
                        user: { token: userToken },
                        name: 'aws',
                    }],
            };
            return spec;
        };
        this.getKubeConfig = (clusterName, clusterEndpoint, clusterCertificate, regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.kubeConfigTemplate(clusterEndpoint, clusterCertificate, yield this.generateUserToken(regionCode, clusterName));
        });
        this.generateUserToken = (regionCode, clusterName, expires = '60', formatTime) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.accessKeyId || !this.secretAccessKey || !regionCode) {
                throw new Error('Lose the accessKeyId, secretAccessKey or region');
            }
            const fullDate = formatTime || dayjs_1.default.utc().format('YYYYMMDDTHHmmss[Z]');
            const subDate = fullDate.substring(0, 8);
            const tokenHeader = this.sessionToken ? `X-Amz-Security-Token=${encodeURIComponent(this.sessionToken)}&` : '';
            const canonicalRequest = 'GET' + '\n' +
                '/' + '\n' +
                'Action=GetCallerIdentity&' +
                'Version=2011-06-15&' +
                'X-Amz-Algorithm=AWS4-HMAC-SHA256&' +
                `X-Amz-Credential=${this.accessKeyId}%2F${subDate}%2F${regionCode}%2Fsts%2Faws4_request&` +
                `X-Amz-Date=${fullDate}&` +
                `X-Amz-Expires=${expires}&` +
                tokenHeader +
                `X-Amz-SignedHeaders=host%3Bx-k8s-aws-id` + '\n' +
                `host:sts.${regionCode}.amazonaws.com\nx-k8s-aws-id:${clusterName}\n` + '\n' +
                'host;x-k8s-aws-id' + '\n' +
                'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
            const hashedCanonicalRequest = crypto.enc.Hex.stringify(crypto.SHA256(canonicalRequest));
            const stringToSign = 'AWS4-HMAC-SHA256' + '\n' +
                fullDate + '\n' +
                `${subDate}/${regionCode}/sts/aws4_request` + '\n' +
                hashedCanonicalRequest;
            const signingKey = ((key, dateStamp, regionName, serviceName) => {
                const kDate = crypto.HmacSHA256(dateStamp, 'AWS4' + key);
                const kRegion = crypto.HmacSHA256(regionName, kDate);
                const kService = crypto.HmacSHA256(serviceName, kRegion);
                const kSigning = crypto.HmacSHA256('aws4_request', kService);
                return kSigning;
            })(this.secretAccessKey, subDate, regionCode, 'sts');
            const signature = crypto.enc.Hex.stringify(crypto.HmacSHA256(stringToSign, signingKey));
            const presignedURL = `https://sts.${regionCode}.amazonaws.com/?` +
                'Action=GetCallerIdentity&' +
                'Version=2011-06-15&' +
                'X-Amz-Algorithm=AWS4-HMAC-SHA256&' +
                `X-Amz-Credential=${this.accessKeyId}%2F${subDate}%2F${regionCode}%2Fsts%2Faws4_request&` +
                `X-Amz-Date=${fullDate}&` +
                `X-Amz-Expires=${expires}&` +
                tokenHeader +
                'X-Amz-SignedHeaders=host%3Bx-k8s-aws-id&' +
                `X-Amz-Signature=${signature}`;
            const base64Encoding = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(presignedURL))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
            const eksToken = 'k8s-aws-v1.' + base64Encoding;
            return eksToken;
        });
    }
    init(accessKeyId, secretAccessKey) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.accessKeyId = accessKeyId;
            this.secretAccessKey = secretAccessKey;
        });
    }
}
exports.AwsEksClient = AwsEksClient;
//# sourceMappingURL=AwsEksClient.js.map