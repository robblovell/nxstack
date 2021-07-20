import { BaseClient } from './BaseClient'

export class EquinixClient extends BaseClient {
    token
    tokenPromise

    get apiURL() { return 'https://api.equinix.com/metal/v1' }

    async headers(service, data?, headers?) {
        const result = await super.headers(service, data, headers) || {}
        result['Accept'] =  'application/json, text/plain'
        delete result['Authorization'] // Not what equinix looks for
        result['X-Auth-Token'] = this.token || process.env.EQUINIX_USER_API_KEY
        return result
    }

    getCapacities = async (): Promise<any[]> => {
        const response = await this.get('/capacity')
        return response.data.capacity
    }

    getFacilities = async (): Promise<any[]> => {
        const response = await this.get('/facilities')
        return response.data.facilities
    }

    getProjects = async (): Promise<any[]> => {
        const response = await this.get('/projects?per_page=999')
        return response.data.projects
    }

    getSshKey = async (id: string): Promise<any> => {
        const response = await this.get(`/ssh-keys/${id}`)
        return response.data
    }

    getUserSshKeys = async (): Promise<any[]> => {
        const response = await this.get('/ssh-keys')
        return response.data.ssh_keys
    }

    getFacilitiesSupportingFeatures = async (requiredFeatures?: string[], levels?: string[]) => {
        const items = []
        const facilities = await this.getFacilities()
        const capacities = await this.getCapacities()
        for (const facility of facilities) {
            if (!requiredFeatures?.length || requiredFeatures.every(feature => facility.features?.includes(feature))) {
                // ensure that the capacity is actually provided by the current facility as this may not be the case due to disparate calls
                if (!capacities[facility.code])
                    continue
                const machineTypes = Object.keys(capacities[facility.code])
                if (!machineTypes?.length)
                    continue
                for (const machineType of machineTypes) {
                    if (!levels?.length || levels.includes(capacities[facility.code][machineType].level)) {
                        items.push(facility)
                        break // no need to search further
                    }
                }
            }       
            else {
                items.push(facility)
            }
        }
        return items
    }

    getAllMachineTypes = async (levels?: string[]) => {
        const facilities = []
        const capacities = await this.getCapacities()
        for (const facility of Object.keys(capacities)) {
            const machineTypes = []
            for (const machineType of Object.keys(capacities[facility]))
                if (!levels?.length || levels.includes(capacities[facility][machineType].level))
                    machineTypes.push(machineType)
            if (machineTypes.length)
                facilities.push({facilityCode: facility, machineType: machineTypes})
        }
        return facilities
    }

    getFacilityMachineTypes = async (facilityCode: string, levels?: string[]) => {
        const capacities = await this.getAllMachineTypes(levels)
        const facility = capacities.find(item => item.facilityCode === facilityCode)
        return facility.machineType
    }
}