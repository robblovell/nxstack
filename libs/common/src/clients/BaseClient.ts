import axios from 'axios'
import * as jose from 'node-jose'
import { injectable } from 'inversify'

@injectable()
export abstract class BaseClient {
    token
    tokenPromise

    privateKey
    privateKeyPromise
    jwkId

    abstract get apiURL(): string

    private parseURL(service: string) {
        if (service.startsWith(this.apiURL) || service.startsWith('http'))
            return service
        if (service.startsWith('/') && this.apiURL.endsWith('/'))
            return `${this.apiURL.substr(0, this.apiURL.length)}${service.substr(1)}`
        else if (!service.startsWith('/') && !this.apiURL.endsWith('/'))
            return `${this.apiURL}/${service}`
        else
            return `${this.apiURL}${service}`
    }

    async init(token?, privateKey?, jwkId?) {
        // We would either have a token or a privateKey
        if (!this.token)
            this.token = token || await this.tokenPromise
        if (!this.privateKey) {
            this.privateKey = privateKey || await this.privateKeyPromise

            // If the private key is a string, it's base64 encoded
            if (this.privateKey && typeof this.privateKey === 'string') {
                // decode the key
                const keyPem = this.isPEM() ?
                    this.privateKey :
                    Buffer.from(this.privateKey, 'base64').toString()
                this.privateKey = await jose.JWK.asKey(keyPem, 'pem')
            }
            this.jwkId = jwkId
        }
    }

    isPEM = () => this.privateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----')

    async headers(service, data?, headers?) {
        if (this.token)
            return { 'Authorization': `Bearer ${this.token}`, ...headers }

        if (this.privateKey) {
            const payload = {
                path: service,
                data
            }

            const header = await jose.JWS
                .createSign({ format: 'compact' }, this.privateKey)
                .update(JSON.stringify(payload))
                .final()

            return { jws: header, jwkId: this.jwkId, ...headers }
        }
    }

    // Data is in JOSE header if there is a private key
    data = (data?) => this.privateKey ? undefined : data

    async get(service, params?) {
        await this.init()
        const path = this.parseURL(service)
        const result = await axios.get(path, { params, headers: await this.headers(service) })
        return result
    }

    async post(service, data?, options?) {
        await this.init()
        const path = this.parseURL(service)
        const result = await axios.post(path, this.data(data), options || { headers: await this.headers(service, data) })
        return result
    }

    async put(service, data?, options?) {
        await this.init()
        const path = this.parseURL(service)
        const result = await axios.put(path, this.data(data), options || { headers: await this.headers(service, data) })
        return result
    }

    async patch(service, data?) {
        await this.init()
        const path = this.parseURL(service)
        return await axios.patch(path, this.data(data), { headers: await this.headers(service, data) })
    }

    async delete(service) {
        const path = this.parseURL(service)
        return await axios.delete(path, { headers: await this.headers(service) })
    }

    toData = (res) => res.data?.data || res.data

    toFirst = (res) => {
        const data = this.toData(res)
        if (data?.length)
            return data[0]
    }
}
