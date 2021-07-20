import { loadLocalAppManifests } from '@c6o/kits'
import { PerformerParams } from '../base'
import { AppPerformer } from './base'

export interface AppPublishParams extends PerformerParams {
    /** Could trigger inquire  */
    account?: string
    forgive?: boolean
    manifest: string

    /** Will never trigger inquire  */
    manifestFile?: any
    accountRecord?: any
}

export class AppPublishPerformer extends AppPerformer<AppPublishParams> {

    async ensure(): Promise<void> {
        this.ensureManifestFile()
        await this.ensureAccountRecord()
    }

    async perform(): Promise<void> {
        /** NO INTERACTION ALLOWED IN PERFORMER */
        for (const singleManifest of this.getManifests())
            await this.publishManifest(singleManifest)
    }

    ensureManifestFile() {
        if (this.params.manifestFile) return

        const { manifest, forgive } = this.params
        const manifestFile = loadLocalAppManifests(this.params.manifest)

        if (!manifestFile || !(manifestFile.appId || Array.isArray(manifestFile))) {
            if (forgive)
                return this.display.warn(`Skipping ${manifest}`)
            else
                throw new Error(`Failed to load the manifest from ${manifest}`)
        }

        //TODO: remove the folowing line?
        //const publishing = Array.isArray(manifest) ? manifest.reduce(((acc, fest) => acc+`${fest.appId}, `), '[') +']': manifest.appId
        this.params.manifestFile = manifestFile
    }

    async ensureAccountRecord() {
        if (this.params.accountRecord) return

        const accounts = await this.hubClient.getAccounts()
        const account = this.params.account ? accounts.find(account => account.namespace === this.params.account) : undefined

        if (this.params.account && !account)
            throw new Error(`Could not find account ${this.params.account}`)

        const response = await super.prompt([
            {
                type: 'list',
                name: 'account',
                message: 'Which account does this Application belong to?',
                when: accounts.length > 1,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                choices: _ => accounts.map(account => ({ name: account.name, value: account })),
                default: 0
            }
        ], { account })

        this.params.accountRecord = response.account

        if (!this.params.accountRecord)
            throw new Error('Unable to determine account to publish to')
    }

    *getManifests() {
        if (Array.isArray(this.params.manifestFile)) {
            for (const singleManifest of this.params.manifestFile)
                yield singleManifest
        }
        else
            yield this.params.manifestFile
    }

    async publishManifest(manifestFile: any) {
        if (this.params.dryRun) {
            this.display.highlight(`Application ${manifestFile.appId} updated`)
            return
        }

        if (this.params.accountRecord?.type === 'o')
            manifestFile.orgId = this.params.accountRecord._id

        const result = await this.hubClient.upsertFromManifest(manifestFile)

        this.display.highlight(`Application ${result.namespace} updated`)
    }
}
