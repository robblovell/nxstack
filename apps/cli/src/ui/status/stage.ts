import { Stage as KubeStage } from '@c6o/kubeclient-contracts'
import cliTruncate from 'cli-truncate'
import { ProvisionerManager } from '@c6o/provisioner'
import { CLIReporter } from '../display/cliReporter'

declare global {
    interface Console {
        draft: (message?: any, ...optionalParams: any[]) => (message?: any, ...optionalParams: any[]) => void
    }
}

export class CLIStage extends KubeStage {
    private icons = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    private currentIcon = 0
    private draft: (msg: string) => void
    private timer: NodeJS.Timer
    private indent: string
    private fillSpaces: string

    constructor(protected reporter: CLIReporter, protected manager?: ProvisionerManager) {
        super()
    }

    begin() {
        super.begin()

        if (this.manager) {
            // We have a manager...
            // Only start rendering at the apply stage
            if (this.manager.stage === 'apply')
                this.beginRender()
        } else
            this.beginRender()
    }

    end() {
        super.end()

        if (this.timer) {
            clearInterval(this.timer)
            delete this.timer
            // Get one final render call in
            this.render()
        }
    }

    beginRender() {
        // eslint-disable-next-line no-console
        this.draft = console.draft()

        this.indent = ' '.repeat(this.depth + 1)
        let spaces = 70 - this.name.length - this.depth
        if (spaces < 1) spaces = 1
        this.fillSpaces = ' '.repeat(spaces)

        if (this.condition === 'running')
            this.timer = setInterval(this.render.bind(this), 100)
        else
            this.render()
    }

    render() {
        // Prevent wrapping
        const drawing = cliTruncate(this.renderRow(), process.stdout.columns)
        this.draft(drawing)
    }

    renderRow() {
        const icon = this.icons[this.currentIcon++]
        if (this.currentIcon === this.icons.length)
            this.currentIcon = 0

        switch (this.condition) {
            case 'error':
                return `${this.reporter.msg.error('✖ ')}${this.indent}${this.reporter.msg.error(this.name)}${this.fillSpaces}${this.reporter.msg.error('Failed!')}`
            case 'skipped':
                return `${this.reporter.msg.warn('✔ ' )}${this.indent}${this.reporter.msg.warn(this.name)}${this.fillSpaces}${this.reporter.msg.warn('Skipped')}`
            case 'done':
                return `${this.reporter.msg.success('✔ ' )}${this.indent}${this.reporter.msg.important(this.name)}${this.fillSpaces}${this.reporter.msg.success('Done')}`
            default:
                return `${this.reporter.msg.warn(`${icon} `)}${this.indent}${this.name}${this.fillSpaces}${this.reporter.msg.warn(this.latestEvent?.message || 'In progress...')}`
        }
    }
}
