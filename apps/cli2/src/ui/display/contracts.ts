export type DisplayClass = '' | 'highlight' | 'error' | 'warn' |  'success' | 'important'

export interface PrintOptions {
    spaceAfter?: boolean
    spaceBefore?: boolean
}

export interface ReporterOptions {
    quiet?: boolean
}

export interface Reporter {

    /**
     * Prints a message
     * @param message, either a string or an array of strings.
     * @param displayClass
     */
    print(message: string | string[], displayClass?: DisplayClass, options?: PrintOptions): void

    // The following are shorthands for displaying a message with an implicit DisplayClass
    error(message: string | string[], options?: PrintOptions): void
    default(message: string | string[], options?: PrintOptions): void
    highlight(message: string | string[], options?: PrintOptions): void
    success(message: string | string[], options?: PrintOptions): void
    warn(message: string | string[], options?: PrintOptions): void

    /**
     * Prints a banner
     * @param title
     * @param messages, either a string or an array of messages to be put on separate lines.
     * @param bannerClass
     */
    banner(title: string, messages: string | string[], displayClass?: DisplayClass): void

    /**
     * Prints a clickable URL if the terminal supports it
     * @param text
     * @param link
     * @param pre
     */
    url(text: string, link: string, pre?: string): void

    /**
     * Prints a Table
     * @param text
     * @param link
     * @param pre
     */
    table(data: Array<any>, columns: any, options?: any): void

    newline(): void
}