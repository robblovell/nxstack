import chalk from 'chalk'
import { cli, Table } from 'cli-ux'
import { DisplayClass, Reporter, ReporterOptions, PrintOptions } from './contracts'

export class CLIReporter implements Reporter {

    SEA = '#5C8BFF'     // CodeZero "sea" but lighter
    FIRE = '#ff5a00'    // CodeZero "fire"
    OCEAN = '#26EEFF'   // CodeZero "ocean" but lighter
    GRASS = '#37EB37'   // CodeZero "grass"
    SUN = '#fae170'     // CodeZero "sun"

    colors = {
        fire: '\\[\\033[38;5;68m\\]',
        ocean: '\\[\\033[38;5;68m\\]',
        reset: '\\[\\033[00m\\]',
        sea: '\\[\\033[38;5;44m\\]',
    }

    bkg = {
        error: chalk.bgHex(this.FIRE),
        highlight: chalk.bgHex(this.OCEAN),
        subtle: chalk.bgHex(this.SEA),
        success: chalk.bgHex(this.GRASS),
        warn: chalk.bgHex(this.SUN),
    }

    msg = {
        error: chalk.hex(this.FIRE).bold,
        highlight: chalk.hex(this.OCEAN),
        important: chalk.hex(this.OCEAN).bold,
        subtle: chalk.hex(this.SEA),
        success: chalk.hex(this.GRASS).bold,
        warn: chalk.hex(this.SUN),
    }

    bannerPreamble = `${this.bkg.highlight('  ')}${this.bkg.warn('  ')}${this.bkg.subtle('  ')}${this.bkg.error('  ')}`
    bannerConclusion = `${this.bkg.error('  ')}${this.bkg.subtle('  ')}${this.bkg.warn('  ')}${this.bkg.highlight('  ')}`

    constructor(
        protected options: ReporterOptions,
        protected printOut = console.log,
        protected errorOut = console.error) {
    }

    formatMessage(msg: string, displayClass?: DisplayClass) {
        if (!displayClass)
            return msg

        switch (displayClass) {
            case 'error':
                return this.msg.error(msg)
            case 'warn':
                return this.msg.warn(msg)
            case 'highlight':
                return this.msg.highlight(msg)
            case 'success':
                return this.msg.success(msg)
            default:
                return msg
        }
    }

    reduceMessages(messages: string | string[], prefix = '') {
        return Array.isArray(messages) ?
            messages.reduce((accumulator, message) => {
                return accumulator + prefix + `${message}\n`
            }, '').trim() :
            prefix + `${messages}`
    }

    print(message: string | string[], displayClass: DisplayClass =  '', displayOptions?: PrintOptions): void {
        if (this.options.quiet && displayClass !== 'error')
            return

        if (displayClass === 'success' || displayOptions?.spaceBefore)
            this.newline()

        this.printOut(this.formatMessage(this.reduceMessages(message), displayClass))

        if (displayOptions?.spaceAfter)
            this.newline()
    }

    default(message: string | string[], displayOptions?: PrintOptions): void {
        this.print(message, '', displayOptions)
    }

    error(message: string | string[], displayOptions?: PrintOptions): void {
        this.print(message, 'error', displayOptions)
    }

    highlight(message: string | string[], displayOptions?: PrintOptions): void {
        this.print(message, 'highlight', displayOptions)
    }

    success(message: string | string[], displayOptions?: PrintOptions): void {
        this.print(message, 'success', displayOptions)
    }

    warn(message: string | string[], displayOptions?: PrintOptions): void {
        this.print(message, 'warn', displayOptions)
    }

    banner(title: string, messages: string | string[], displayClass: DisplayClass = '') {
        if (!this.options.quiet) {
            this.printOut(this.formatMessage('\u0007\n**********************************************************************', displayClass))
            this.printOut(`${this.bannerPreamble
            }                ${this.formatMessage(title, displayClass)
            }                ${this.bannerConclusion
            }`)
            const textType = displayClass === 'error' || displayClass === 'warn' ? 'highlight' : ''
            this.printOut(this.formatMessage(this.reduceMessages(messages), textType))
            this.printOut(this.formatMessage('**********************************************************************', displayClass))
        }
    }

    url(text: string, link: string, pre?: string) {
        if (pre)
            this.printOut(pre)
        cli.url(text, link)
    }

    table(data: any[], inputOptions?: Partial<Table.TableOptions>) {
        if (!this.options.quiet)
            cli.table(data, inputOptions)
    }

    newline(lineCount = 1) {
        do {
            this.printOut('')
        } while (--lineCount>0)
    }
}
