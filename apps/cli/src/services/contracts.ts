export interface Session {
    readonly signature: string
    readonly signatureHash: string

    dependantCount(): Promise<number>
    setDescription(string): Promise<void>

    lock(): Promise<boolean>
    release(): Promise<void>
    dispose(): Promise<void>

    any(items: string[]): Promise<boolean>
    set(key: string, value: any): Promise<void>
    get<T>(key: string): Promise<T>
    remove(key: string): Promise<void>
}