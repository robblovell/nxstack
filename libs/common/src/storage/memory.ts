import { injectable } from 'inversify'

@injectable()
export class MemoryStorage {
    private storage = {}
    key = (n) : string => Object.keys(this.storage)[n]
    getItem = <T>(key): T => this.storage[key]
    setItem = <T>(key : string, value: T) => this.storage[key] = value
    removeItem = (key: string) => delete this.storage[key]
    clear = () => {
        delete this.storage
        this.storage = {}
    }
}