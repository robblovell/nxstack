"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquinixClient = void 0;
const tslib_1 = require("tslib");
const BaseClient_1 = require("./BaseClient");
class EquinixClient extends BaseClient_1.BaseClient {
    constructor() {
        super(...arguments);
        this.getCapacities = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get('/capacity');
            return response.data.capacity;
        });
        this.getFacilities = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get('/facilities');
            return response.data.facilities;
        });
        this.getProjects = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get('/projects?per_page=999');
            return response.data.projects;
        });
        this.getSshKey = (id) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get(`/ssh-keys/${id}`);
            return response.data;
        });
        this.getUserSshKeys = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield this.get('/ssh-keys');
            return response.data.ssh_keys;
        });
        this.getFacilitiesSupportingFeatures = (requiredFeatures, levels) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const items = [];
            const facilities = yield this.getFacilities();
            const capacities = yield this.getCapacities();
            for (const facility of facilities) {
                if (!(requiredFeatures === null || requiredFeatures === void 0 ? void 0 : requiredFeatures.length) || requiredFeatures.every(feature => { var _a; return (_a = facility.features) === null || _a === void 0 ? void 0 : _a.includes(feature); })) {
                    if (!capacities[facility.code])
                        continue;
                    const machineTypes = Object.keys(capacities[facility.code]);
                    if (!(machineTypes === null || machineTypes === void 0 ? void 0 : machineTypes.length))
                        continue;
                    for (const machineType of machineTypes) {
                        if (!(levels === null || levels === void 0 ? void 0 : levels.length) || levels.includes(capacities[facility.code][machineType].level)) {
                            items.push(facility);
                            break;
                        }
                    }
                }
                else {
                    items.push(facility);
                }
            }
            return items;
        });
        this.getAllMachineTypes = (levels) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const facilities = [];
            const capacities = yield this.getCapacities();
            for (const facility of Object.keys(capacities)) {
                const machineTypes = [];
                for (const machineType of Object.keys(capacities[facility]))
                    if (!(levels === null || levels === void 0 ? void 0 : levels.length) || levels.includes(capacities[facility][machineType].level))
                        machineTypes.push(machineType);
                if (machineTypes.length)
                    facilities.push({ facilityCode: facility, machineType: machineTypes });
            }
            return facilities;
        });
        this.getFacilityMachineTypes = (facilityCode, levels) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const capacities = yield this.getAllMachineTypes(levels);
            const facility = capacities.find(item => item.facilityCode === facilityCode);
            return facility.machineType;
        });
    }
    get apiURL() { return 'https://api.equinix.com/metal/v1'; }
    headers(service, data, headers) {
        const _super = Object.create(null, {
            headers: { get: () => super.headers }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = (yield _super.headers.call(this, service, data, headers)) || {};
            result['Accept'] = 'application/json, text/plain';
            delete result['Authorization'];
            result['X-Auth-Token'] = this.token || process.env.EQUINIX_USER_API_KEY;
            return result;
        });
    }
}
exports.EquinixClient = EquinixClient;
//# sourceMappingURL=EquinixClient.js.map