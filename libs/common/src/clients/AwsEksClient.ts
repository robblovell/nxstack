import { NotImplemented } from '@feathersjs/errors'
//import { BaseClient } from './BaseClient'
import * as crypto from 'crypto-js'
import * as aws4 from 'aws4'
import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export class AwsEksClient /*extends BaseClient*/ {
    accessKeyId
    secretAccessKey
    sessionToken
    isReady = false

    apiURL = (regionCode: string) => { return `https://eks.${regionCode}.amazonaws.com` }

    async init(accessKeyId, secretAccessKey) {
        this.accessKeyId = accessKeyId
        this.secretAccessKey = secretAccessKey
        //await super.init(token || process.env.AWS_TOKEN)
    }

    createCluster = async (spec: any, regionCode: string) => {
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
        }

        const signedRequest = aws4.sign(request,
            {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return await axios(signedRequest)
    }

    createNodeGroup = async (clusterName: string, spec: any, regionCode: string) => {
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
        }

        const signedRequest = aws4.sign(request,
            {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return await axios(signedRequest)
    }

    deleteCluster = async (name: string, regionCode: string) => {
        const request = {
            host: new URL(this.apiURL(regionCode)).host,
            method: 'DELETE',
            url: `${this.apiURL(regionCode)}/clusters/${name}`,
            path: `/clusters/${name}`,
            region: regionCode,
            service: 'eks'
        }

        const signedRequest = aws4.sign(request,
            {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return await axios(signedRequest)
    }

    getClusters = async (regionCode: string) => {
        const request = {
            host: new URL(this.apiURL(regionCode)).host,
            method: 'GET',
            url: `${this.apiURL(regionCode)}/clusters`,
            path: '/clusters',
            region: regionCode,
            service: 'eks'
        }

        const signedRequest = aws4.sign(request,
            {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return await axios(signedRequest)
    }

    getCluster = async (name: string, regionCode: string) => {
        const request = {
            host: new URL(this.apiURL(regionCode)).host,
            method: 'GET',
            url: `${this.apiURL(regionCode)}/clusters/${name}`,
            path: `/clusters/${name}`,
            region: regionCode,
            service: 'eks'
        }

        const signedRequest = aws4.sign(request,
            {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return await axios(signedRequest)
    }

    getNodeGroups = async (clusterName: string, regionCode: string) => {
        const request = {
            host: new URL(this.apiURL(regionCode)).host,
            method: 'GET',
            url: `${this.apiURL(regionCode)}/clusters/${clusterName}/node-groups`,
            path: `/clusters/${clusterName}/node-groups`,
            region: regionCode,
            service: 'eks'
        }

        const signedRequest = aws4.sign(request,
            {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return await axios(signedRequest)
    }

    getNodeGroup = async (clusterName: string, name: string, regionCode: string) => {
        const request = {
            host: new URL(this.apiURL(regionCode)).host,
            method: 'GET',
            url: `${this.apiURL(regionCode)}/clusters/${clusterName}/node-groups/${name}`,
            path: `/clusters/${clusterName}/node-groups/${name}`,
            region: regionCode,
            service: 'eks'
        }

        const signedRequest = aws4.sign(request,
            {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            })
        delete signedRequest.headers['Host']
        delete signedRequest.headers['Content-Length']

        return await axios(signedRequest)
    }

    waitForCluster = async (name: string) => {
        throw new NotImplemented('')
    }

    private kubeConfigTemplate = (clusterEndpoint: string, clusterCertificate: string, userToken: string) => {
        const spec: any = {
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
        }
        return spec
    }

    getKubeConfig = async (clusterName: string, clusterEndpoint: string, clusterCertificate: string, regionCode: string) => {
        return this.kubeConfigTemplate(clusterEndpoint, clusterCertificate, await this.generateUserToken(regionCode, clusterName))
    }

    // excerpt from https://github.com/qinshuang1998/aws-eks-token
    // but repurposed because it wasn't packaging properly
    generateUserToken = async (regionCode: string, clusterName, expires = '60', formatTime?) => {
        if (!this.accessKeyId || !this.secretAccessKey || !regionCode) {
            throw new Error('Lose the accessKeyId, secretAccessKey or region')
        }
        // YYYYMMDD'T'HHMMSS'Z'
        const fullDate = formatTime || dayjs.utc().format('YYYYMMDDTHHmmss[Z]')
        const subDate = fullDate.substring(0, 8)
        const tokenHeader = this.sessionToken ? `X-Amz-Security-Token=${encodeURIComponent(this.sessionToken)}&` : ''
        const canonicalRequest =
            'GET' + '\n' +
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
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        const hashedCanonicalRequest = crypto.enc.Hex.stringify(crypto.SHA256(canonicalRequest))
        const stringToSign =
            'AWS4-HMAC-SHA256' + '\n' +
            fullDate + '\n' +
            `${subDate}/${regionCode}/sts/aws4_request` + '\n' +
            hashedCanonicalRequest
        const signingKey = ((key, dateStamp, regionName, serviceName) => {
            const kDate = crypto.HmacSHA256(dateStamp, 'AWS4' + key)
            const kRegion = crypto.HmacSHA256(regionName, kDate)
            const kService = crypto.HmacSHA256(serviceName, kRegion)
            const kSigning = crypto.HmacSHA256('aws4_request', kService)
            return kSigning
        })(this.secretAccessKey, subDate, regionCode, 'sts')
        const signature = crypto.enc.Hex.stringify(crypto.HmacSHA256(stringToSign, signingKey))
        const presignedURL =
            `https://sts.${regionCode}.amazonaws.com/?` +
            'Action=GetCallerIdentity&' +
            'Version=2011-06-15&' +
            'X-Amz-Algorithm=AWS4-HMAC-SHA256&' +
            `X-Amz-Credential=${this.accessKeyId}%2F${subDate}%2F${regionCode}%2Fsts%2Faws4_request&` +
            `X-Amz-Date=${fullDate}&` +
            `X-Amz-Expires=${expires}&` +
            tokenHeader +
            'X-Amz-SignedHeaders=host%3Bx-k8s-aws-id&' +
            `X-Amz-Signature=${signature}`
        const base64Encoding = crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(presignedURL))
            // for url safe
            .replace(/\+/g, '-') // Convert '+' to '-'
            .replace(/\//g, '_') // Convert '/' to '_'
            .replace(/=+$/, '') // Remove ending '='
        const eksToken = 'k8s-aws-v1.' + base64Encoding
        return eksToken
    }
}