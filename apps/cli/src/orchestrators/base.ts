import { TerminalUI } from '../ui'
import { OrchestratorParams } from './params'
import * as semver from 'semver'

export abstract class Orchestrator<P extends OrchestratorParams = OrchestratorParams, UI extends TerminalUI<P> = TerminalUI<P>> {

    private _ui: UI
    get UI(): UI {
        // NOTE: Not sure we should cache as params mutate
        // however, the reference to params should not mutate
        // so caching should be safe
        if (this._ui) return this._ui
        return this._ui = this.newUI()
    }

    // This is here so sub-classes can override it to create custom sub-classes
    protected newUI() {
        return new TerminalUI<P>(this.params) as UI
    }

    constructor(protected params: P) {
        if (semver.lt(process.version, '13.0.0')) {
            throw Error(`Node.js version 13.0.0 or newer required (you are currently using Node.js ${process.version.toString()}).`)
        }
    }

    abstract apply(): Promise<void>
}