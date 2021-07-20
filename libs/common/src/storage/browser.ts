import { injectable } from 'inversify'
import * as LocalStorage from 'localstorage-memory'

@injectable()
export class BrowserStorage {
    key = (n) : string => LocalStorage.key(n)
    getItem = <T>(key): T => LocalStorage.getItem(key)
    setItem = <T>(key : string, value: T) => LocalStorage.setItem(key, value)
    removeItem = (key: string) => LocalStorage.removeItem(key)
    clear = () => LocalStorage.clear()
}