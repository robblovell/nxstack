//import { BaseClient } from './BaseClient'
import * as aws4 from 'aws4'
import axios from 'axios'
import { Parser } from 'xml2js'

export class AwsEc2Client /*extends BaseClient*/ {
    accessKeyId
    secretAccessKey
    apiVersion = '2016-11-15'
    isReady = false

    apiURL = (regionCode?: string) => { return `https://ec2${regionCode ? '.' + regionCode : ''}.amazonaws.com` }

    async init(accessKeyId, secretAccessKey) {
        this.accessKeyId = accessKeyId
        this.secretAccessKey = secretAccessKey
        //await super.init()
    }

    sendRequest = async (action: string, regionCode?: string, params?: any) => {
        const opts = {
            host: new URL(this.apiURL(regionCode)).host,
            method: 'GET',
            url: `${this.apiURL(regionCode)}`,
            path: `/?Version=${this.apiVersion}&Action=${action}`,
            service: 'ec2',
            params: {
                Version: this.apiVersion,
                Action: action,
                ...params
            },
        }
        if (params) {
            for (const key of Object.keys(params))
            opts.path += `&${key}=${params[key]}`
        }

        const signedRequest = aws4.sign(opts,
            {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return await axios(signedRequest)
    }

    getSshKeyPairs = async (regionCode: string) => {
        const response = await this.sendRequest('DescribeKeyPairs', regionCode)
        if (response.data) {
            const parser = new Parser({ explicitArray : false })
            const json = await parser.parseStringPromise(response.data)
            .then(function (result) {
                if (!Array.isArray(result.DescribeKeyPairsResponse?.keySet?.item))
                    return [result.DescribeKeyPairsResponse?.keySet?.item]
                return result.DescribeKeyPairsResponse?.keySet?.item
            })
            .catch(function (error) {
                return error
            })
            return json
        }
    }

    createSshKeyPair = async (regionCode: string, name: string) => {
        const response = await this.sendRequest('CreateKeyPair', regionCode,
        {
            'KeyName': name,
            'TagSpecification.1.Tag.1.Key': 'managed-by',
            'TagSpecification.1.Tag.1.Value': 'CodeZero Technologies Inc.',
            'TagSpecification.1.ResourceType': 'key-pair',
        })
        if (response.data) {
            const parser = new Parser({ explicitArray : false })
            const json = await parser.parseStringPromise(response.data)
            .then(function (result) {
                return result.CreateKeyPairResponse
            })
            .catch(function (error) {
                return error
            })
            return json
        }
    }

    getRegions = async () => {
        const response = await this.sendRequest('DescribeRegions')
        if (response.data) {
            const parser = new Parser({ explicitArray : false })
            const json = await parser.parseStringPromise(response.data)
            .then(function (result) {
                return result.DescribeRegionsResponse?.regionInfo?.item
            })
            .catch(function (error) {
                return error
            })
            return json
        }
    }

    getMachineTypes = async (regionCode: string) => {
        let items: any[] = []
        let nextToken

        do {
            const options: any = {
                'Filter.1.Name': 'current-generation',
                'Filter.1.Value.1': 'true',
                'Filter.2.Name': 'bare-metal',
                'Filter.2.Value.1': 'false',
                'Filter.3.Name': 'processor-info.supported-architecture',
                'Filter.3.Value.1': 'x86_64',
                'Filter.4.Name': 'instance-type',
                'Filter.4.Value.1': 't*',
            }
            if (nextToken)
                options.NextToken = nextToken
            const response = await this.sendRequest('DescribeInstanceTypes', regionCode, options)
        if (response.data) {
            const parser = new Parser({ explicitArray : false })
                items = items.concat(await parser.parseStringPromise(response.data)
            .then(function (result) {
                    nextToken = result.DescribeInstanceTypesResponse?.nextToken
                return result.DescribeInstanceTypesResponse?.instanceTypeSet?.item
            })
            .catch(function (error) {
                return error
                }))
        }
        } while (nextToken)

        return items
    }

    getSubnets = async (regionCode: string, vpcId: string) => {
        const response = await this.sendRequest('DescribeSubnets', regionCode,
            {
                'Filter.1.Name': 'vpc-id',
                'Filter.1.Value.1': vpcId,
                'Filter.2.Name': 'state',
                'Filter.2.Value.1': 'available'
            })
        if (response.data) {
            const parser = new Parser({ explicitArray : false })
            const json = await parser.parseStringPromise(response.data)
            .then(function (result) {
                if (!Array.isArray(result.DescribeSubnetsResponse?.subnetSet?.item))
                    return [result.DescribeSubnetsResponse?.subnetSet?.item]
                return result.DescribeSubnetsResponse?.subnetSet?.item
            })
            .catch(function (error) {
                return error
            })
            return json
        }
    }

    createSubnet = async (regionCode: string, name: string) => {
        const response = await this.sendRequest('CreateKeyPair', regionCode,
        {
            'KeyName': name,
            'TagSpecification.1.Tag.1.Key': 'managed-by',
            'TagSpecification.1.Tag.1.Value': 'CodeZero Technologies Inc.',
            'TagSpecification.1.ResourceType': 'key-pair',
        })
        if (response.data) {
            const parser = new Parser({ explicitArray : false })
            const json = await parser.parseStringPromise(response.data)
            .then(function (result) {
                return result.CreateKeyPairResponse
            })
            .catch(function (error) {
                return error
            })
            return json
        }
    }

    getVpcs = async (regionCode: string) => {
        const response = await this.sendRequest('DescribeVpcs', regionCode)
        if (response.data) {
            const parser = new Parser({ explicitArray : false })
            const json = await parser.parseStringPromise(response.data)
            .then(function (result) {
                if (!Array.isArray(result.DescribeVpcsResponse?.vpcSet?.item))
                    return [result.DescribeVpcsResponse?.vpcSet?.item]
                return result.DescribeVpcsResponse?.vpcSet?.item
            })
            .catch(function (error) {
                return error
            })
            return json
        }
    }

    createVpc = async (regionCode: string,) => {
        const response = await this.sendRequest('CreateVpc', regionCode,
        {
            'CidrBlock': '10.0.1.0/24',
            'TagSpecification.1.Tag.1.Key': 'managed-by',
            'TagSpecification.1.Tag.1.Value': 'CodeZero Technologies Inc.',
            'TagSpecification.1.ResourceType': 'vpc',
        })
        if (response.data) {
            const parser = new Parser({ explicitArray : false })
            const json = await parser.parseStringPromise(response.data)
            .then(function (result) {
                return result.CreateVpcResponse?.vpc
            })
            .catch(function (error) {
                return error
            })
            return json
        }
    }
}