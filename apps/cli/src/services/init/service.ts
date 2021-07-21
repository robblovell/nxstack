import { InitParams } from '../params'
import { Service } from '../base'
import { installKubefwd } from '@c6o/kubefwd'

export class Init extends Service<InitParams> {

    async execute() {
        await this.wrapStatus('Initializing CodeZero', async () => {
            await this.initKubefwd()

            // TODO: is there anything else we can/should initialize?
        })
    }

    async initKubefwd() {
        await this.wrapStatus('Configuring teleport service and permissions', async () => {
            if (this.params.dryRun) {
                // Don't actually download and install kubefwd in dry-run mode.
            } else {
                await installKubefwd()
            }
        })
    }
}