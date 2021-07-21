import { Orchestrator } from './base'
import { InitParams } from '../services/params/init'
import { Init as InitService } from '../services/'

export class Init extends Orchestrator<InitParams> {

    async apply() {

        this.params = await this.UI.prompt(
            // We need root access to finish setting up kubefwd
            this.ensureRoot(),
        )

        const init = new InitService(this.params)
        await init.execute()
    }

    ensureRoot() {
        if (process.getuid() !== 0) {
            throw new Error('You need to run this command as root.\nTry: \'sudo czctl init\'')
        }
    }
}
