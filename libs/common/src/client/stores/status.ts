/* eslint-disable no-console */
import { injectable, inject } from 'inversify'
import { observable, computed } from 'mobx'
import { Symbols } from '../../DI/symbols'

@injectable()
export class StatusStore {

    @inject(Symbols.config)
    config

    @observable status: any

    @computed get initialized() { return !!this.status }

    async fetch(path: string) {

        const url = `${this.config.apiURL}${path}`
        console.log('API:', url)

        try {
            const result = await window.fetch(url)
            if (result.status === 200) {
                const status = await result.json()
                // The server can override config values
                this.config.init(status.config)
                this.status = status
                console.log(`STATUS: version ${this.status.version} of sha ${this.status.gitSHA}`)
            }
        }
        catch(ex) {
            console.log(`Failed to connect to API at ${url}`, ex)
        }
    }
}