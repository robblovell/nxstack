import { createDebug } from '@c6o/logger'
import { lock } from 'proper-lockfile'
import { homedir } from 'os'
import fs from 'fs/promises'
import { LockingSessionStorage } from './contracts'
import { ensureOwner } from './io'
import fse from 'fs-extra'
import { SessionDescription } from '../composite'
import { Session } from '../session'

const debug = createDebug()

export class FileSessionStorage implements LockingSessionStorage {
    private lockRelease: () => void
    _disposed = false

    static get locksLocation() { return `${homedir()}/.codezero/locks/`}

    private get configFile() {
        return `${FileSessionStorage.locksLocation}${this.keySignature}.json`
    }

    constructor(private keySignature: string) {
    }

    disposed(): boolean {
        return this._disposed
    }

    private async exists() {
        try {
            await fs.access(this.configFile)
            return true
        } catch {
            return false
        }
    }

    async save(data: string): Promise<void> {
        debug('save %o', data)
        await fs.writeFile(this.configFile, JSON.stringify(data, null, 2))
        await ensureOwner(this.configFile)
    }

    async create(data: string): Promise<void> {
        await this.save(data)
    }

    async load(): Promise<any> {
        const data = await fs.readFile(this.configFile, 'utf-8')
        return JSON.parse(data)
    }

    static containerQuery(): string {
        return FileSessionStorage.locksLocation
    }

    list = FileSessionStorage.list

    static async list(): Promise<SessionDescription[]> {
        await FileSessionStorage.ensureLocksDir()
        const files = await fse.readdir(FileSessionStorage.locksLocation)
        const sessionFiles = files.filter(fn => fn.endsWith('.json'))
        const contentPromises = sessionFiles.map(async file => {
            const content = await fse.readJSON(FileSessionStorage.locksLocation + file)
            return content[Session.descriptionKey]
        })
        const content = await Promise.all(contentPromises)
        return content.filter(c => !!c)
    }

    static async subSessionList(): Promise<string[]> {
        await FileSessionStorage.ensureLocksDir()
        const files = await fse.readdir(FileSessionStorage.locksLocation)
        const sessionFiles = files.filter(fn => fn.endsWith('.json'))
        const contentPromises = sessionFiles.map(async file => {
            const content = await fse.readJSON(FileSessionStorage.locksLocation + file)
            if (!content[Session.descriptionKey])
                return file
        })

        const content = await Promise.all(contentPromises)
        return content.filter(c => !!c)
    }


    static async purge(): Promise<void> {
        await fse.remove(FileSessionStorage.locksLocation)
    }

    private static async ensureLocksDir() {
        await fse.ensureDir(FileSessionStorage.locksLocation)
        await ensureOwner(FileSessionStorage.locksLocation)
    }

    // todo: need a proper name here.
    async ensure(data?: string): Promise<boolean> {
        debug('locks folder %s', FileSessionStorage.locksLocation)
        if (!await this.exists()) {
            await FileSessionStorage.ensureLocksDir()
            if (data)
                await this.create(data)
            return true
        }
        return false
    }

    async lock(): Promise<void> {
        if (this._disposed)
            throw new Error('Attempt to lock when no lock exists')
        try {
            this.lockRelease = await lock(this.configFile)
        } catch (error) {
            throw new Error('Attempt to use a locked resource.')
        }
    }

    async release() {
        // Safe to call release after dispose
        if (this._disposed) return
        // Free the lockFile
        debug('freeing the lock: %s', this.configFile)

        await this.lockRelease?.()
    }

    async dispose() {
        try {
            await this.release()
            debug('calling unlink on: %s', this.configFile)
            await fs.unlink(this.configFile)
            this._disposed = true
        } catch (error) {
            debug('error: %o', error)
            throw error
        }
    }
}
