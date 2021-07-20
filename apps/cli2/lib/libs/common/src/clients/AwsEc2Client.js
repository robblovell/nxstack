"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsEc2Client = void 0;
const tslib_1 = require("tslib");
const aws4 = tslib_1.__importStar(require("aws4"));
const axios_1 = tslib_1.__importDefault(require("axios"));
const xml2js_1 = require("xml2js");
class AwsEc2Client {
    constructor() {
        this.apiVersion = '2016-11-15';
        this.isReady = false;
        this.apiURL = (regionCode) => { return `https://ec2${regionCode ? '.' + regionCode : ''}.amazonaws.com`; };
        this.sendRequest = (action, regionCode, params) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const opts = {
                host: new URL(this.apiURL(regionCode)).host,
                method: 'GET',
                url: `${this.apiURL(regionCode)}`,
                path: `/?Version=${this.apiVersion}&Action=${action}`,
                service: 'ec2',
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
        this.getSshKeyPairs = (regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendRequest('DescribeKeyPairs', regionCode);
            if (response.data) {
                const parser = new xml2js_1.Parser({ explicitArray: false });
                const json = yield parser.parseStringPromise(response.data)
                    .then(function (result) {
                    var _a, _b, _c, _d, _e, _f;
                    if (!Array.isArray((_b = (_a = result.DescribeKeyPairsResponse) === null || _a === void 0 ? void 0 : _a.keySet) === null || _b === void 0 ? void 0 : _b.item))
                        return [(_d = (_c = result.DescribeKeyPairsResponse) === null || _c === void 0 ? void 0 : _c.keySet) === null || _d === void 0 ? void 0 : _d.item];
                    return (_f = (_e = result.DescribeKeyPairsResponse) === null || _e === void 0 ? void 0 : _e.keySet) === null || _f === void 0 ? void 0 : _f.item;
                })
                    .catch(function (error) {
                    return error;
                });
                return json;
            }
        });
        this.createSshKeyPair = (regionCode, name) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendRequest('CreateKeyPair', regionCode, {
                'KeyName': name,
                'TagSpecification.1.Tag.1.Key': 'managed-by',
                'TagSpecification.1.Tag.1.Value': 'CodeZero Technologies Inc.',
                'TagSpecification.1.ResourceType': 'key-pair',
            });
            if (response.data) {
                const parser = new xml2js_1.Parser({ explicitArray: false });
                const json = yield parser.parseStringPromise(response.data)
                    .then(function (result) {
                    return result.CreateKeyPairResponse;
                })
                    .catch(function (error) {
                    return error;
                });
                return json;
            }
        });
        this.getRegions = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendRequest('DescribeRegions');
            if (response.data) {
                const parser = new xml2js_1.Parser({ explicitArray: false });
                const json = yield parser.parseStringPromise(response.data)
                    .then(function (result) {
                    var _a, _b;
                    return (_b = (_a = result.DescribeRegionsResponse) === null || _a === void 0 ? void 0 : _a.regionInfo) === null || _b === void 0 ? void 0 : _b.item;
                })
                    .catch(function (error) {
                    return error;
                });
                return json;
            }
        });
        this.getMachineTypes = (regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let items = [];
            let nextToken;
            do {
                const options = {
                    'Filter.1.Name': 'current-generation',
                    'Filter.1.Value.1': 'true',
                    'Filter.2.Name': 'bare-metal',
                    'Filter.2.Value.1': 'false',
                    'Filter.3.Name': 'processor-info.supported-architecture',
                    'Filter.3.Value.1': 'x86_64',
                    'Filter.4.Name': 'instance-type',
                    'Filter.4.Value.1': 't*',
                };
                if (nextToken)
                    options.NextToken = nextToken;
                const response = yield this.sendRequest('DescribeInstanceTypes', regionCode, options);
                if (response.data) {
                    const parser = new xml2js_1.Parser({ explicitArray: false });
                    items = items.concat(yield parser.parseStringPromise(response.data)
                        .then(function (result) {
                        var _a, _b, _c;
                        nextToken = (_a = result.DescribeInstanceTypesResponse) === null || _a === void 0 ? void 0 : _a.nextToken;
                        return (_c = (_b = result.DescribeInstanceTypesResponse) === null || _b === void 0 ? void 0 : _b.instanceTypeSet) === null || _c === void 0 ? void 0 : _c.item;
                    })
                        .catch(function (error) {
                        return error;
                    }));
                }
            } while (nextToken);
            return items;
        });
        this.getSubnets = (regionCode, vpcId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendRequest('DescribeSubnets', regionCode, {
                'Filter.1.Name': 'vpc-id',
                'Filter.1.Value.1': vpcId,
                'Filter.2.Name': 'state',
                'Filter.2.Value.1': 'available'
            });
            if (response.data) {
                const parser = new xml2js_1.Parser({ explicitArray: false });
                const json = yield parser.parseStringPromise(response.data)
                    .then(function (result) {
                    var _a, _b, _c, _d, _e, _f;
                    if (!Array.isArray((_b = (_a = result.DescribeSubnetsResponse) === null || _a === void 0 ? void 0 : _a.subnetSet) === null || _b === void 0 ? void 0 : _b.item))
                        return [(_d = (_c = result.DescribeSubnetsResponse) === null || _c === void 0 ? void 0 : _c.subnetSet) === null || _d === void 0 ? void 0 : _d.item];
                    return (_f = (_e = result.DescribeSubnetsResponse) === null || _e === void 0 ? void 0 : _e.subnetSet) === null || _f === void 0 ? void 0 : _f.item;
                })
                    .catch(function (error) {
                    return error;
                });
                return json;
            }
        });
        this.createSubnet = (regionCode, name) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendRequest('CreateKeyPair', regionCode, {
                'KeyName': name,
                'TagSpecification.1.Tag.1.Key': 'managed-by',
                'TagSpecification.1.Tag.1.Value': 'CodeZero Technologies Inc.',
                'TagSpecification.1.ResourceType': 'key-pair',
            });
            if (response.data) {
                const parser = new xml2js_1.Parser({ explicitArray: false });
                const json = yield parser.parseStringPromise(response.data)
                    .then(function (result) {
                    return result.CreateKeyPairResponse;
                })
                    .catch(function (error) {
                    return error;
                });
                return json;
            }
        });
        this.getVpcs = (regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendRequest('DescribeVpcs', regionCode);
            if (response.data) {
                const parser = new xml2js_1.Parser({ explicitArray: false });
                const json = yield parser.parseStringPromise(response.data)
                    .then(function (result) {
                    var _a, _b, _c, _d, _e, _f;
                    if (!Array.isArray((_b = (_a = result.DescribeVpcsResponse) === null || _a === void 0 ? void 0 : _a.vpcSet) === null || _b === void 0 ? void 0 : _b.item))
                        return [(_d = (_c = result.DescribeVpcsResponse) === null || _c === void 0 ? void 0 : _c.vpcSet) === null || _d === void 0 ? void 0 : _d.item];
                    return (_f = (_e = result.DescribeVpcsResponse) === null || _e === void 0 ? void 0 : _e.vpcSet) === null || _f === void 0 ? void 0 : _f.item;
                })
                    .catch(function (error) {
                    return error;
                });
                return json;
            }
        });
        this.createVpc = (regionCode) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.sendRequest('CreateVpc', regionCode, {
                'CidrBlock': '10.0.1.0/24',
                'TagSpecification.1.Tag.1.Key': 'managed-by',
                'TagSpecification.1.Tag.1.Value': 'CodeZero Technologies Inc.',
                'TagSpecification.1.ResourceType': 'vpc',
            });
            if (response.data) {
                const parser = new xml2js_1.Parser({ explicitArray: false });
                const json = yield parser.parseStringPromise(response.data)
                    .then(function (result) {
                    var _a;
                    return (_a = result.CreateVpcResponse) === null || _a === void 0 ? void 0 : _a.vpc;
                })
                    .catch(function (error) {
                    return error;
                });
                return json;
            }
        });
    }
    init(accessKeyId, secretAccessKey) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.accessKeyId = accessKeyId;
            this.secretAccessKey = secretAccessKey;
        });
    }
}
exports.AwsEc2Client = AwsEc2Client;
//# sourceMappingURL=AwsEc2Client.js.map