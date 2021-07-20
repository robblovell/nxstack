import { Resource, ResourceId, Watcher } from '@c6o/kubeclient-contracts'
import { createDebug } from '@c6o/logger'
import { Service } from '../base'
import { MonitorParams } from './params'

const debug = createDebug()

export type MonitorFactory = new (params: MonitorParams) => Monitor
export class Monitor<R extends Resource = Resource, P extends MonitorParams = MonitorParams> extends Service<P> {
    watcher: Watcher
    parent: Monitor
    children = new Map<string, Monitor>()

    protected key: string
    protected stopped: boolean
    protected current: R

    async start() {
        if (this.watcher) return // Already watching
        this.key = Monitor.toKey(this.params.resourceQuery)
        debug('starting %s', this.key)
        const result = await this.params.cluster.watch(this.params.resourceQuery, this.watchCallback, this.watchDone)
        result.throwIfError()
        this.watcher = result.otherAs<Watcher>()
    }

    async stop() {
        this.stopped = true
        this.watcher?.disposer()
        this.watcher = null
        for (const [, child] of this.children.entries())
            await child.stop()
        this.children.clear()
    }

    private watchDone = async (error) => {
        if (error?.code === 'ECONNRESET')
            error = null
        debug('watch done for %o', this.params.resourceQuery)

        this.watcher = null
        await this.stop()
    }

    private watchCallback = async (operation: string, resource: Resource) => {
        if (this.stopped) return
        switch (operation) {
            case 'ADDED':
                await this.processAdded(resource)
                break
            case 'MODIFIED':
                await this.processModified(resource)
                break
            case 'REMOVED':
                await this.processRemoved(resource)
                break
        }
    }

    debounce(func, timeout = this.params.debounce || 300) {
        let timer
        return (...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => { func.apply(this, args) }, timeout)
        }
    }

    private debouncedRefresh = this.debounce(this.refresh)

    private async processRefresh() {
        if (this.parent)
            return await this.parent.processRefresh()
        await this.debouncedRefresh()
    }

    protected *each() {
        for (const [, child] of this.children.entries())
            yield *child.each()
        yield this
    }

    protected async refresh() {
        // Do something interesting in a sub class!
        debug('refresh %s %d', this.key, this.children.size)
    }

    protected async onAdded() {
        // Do something interesting in a sub class!
        debug('added %s %o %d', this.key, this.current, this.children.size)
        return true
    }

    protected async onModified() {
        // Do something interesting in a sub class!
        debug('modified %s %o %d', this.key, this.current, this.children.size)
        return true
    }

    protected monitorFactory(resource: Resource): MonitorFactory {
        throw new Error(`Monitor Factory not implemented for ${resource.kind}`)
    }


    protected async addChild(resource: Resource, key?: string) {
        key = key || Monitor.toKey(resource)
        const child = this.children.get(key)
        debug('child %s %o', key, child)
        if (!child) {
            debug('adding child %s %o', key, resource)
            const factory = this.monitorFactory(resource)
            const newChild = new factory({
                ...this.params,
                resourceQuery: resource as ResourceId<R>
            })
            newChild.parent = this
            this.children.set(key, newChild)
            await newChild.start()
        }
    }

    protected async removeChild(key: string, deferRefresh = false) {
        const child = this.children.get(key)
        if (child) {
            debug('removing child %s %o', key, child.current)
            await child.stop()
            this.children.delete(key)
            if (!deferRefresh)
                await this.processRefresh()
        }
    }

    protected async reload(...resources: Resource[]) {
        const keys = []
        let hasAdditions = false
        for (const resource of resources) {
            const key = Monitor.toKey(resource)
            if (!this.children.has(key)) {
                await this.addChild(resource, key)
                hasAdditions = true
            }
            keys.push(key)
        }

        const currentChildren = Array.from(this.children.keys())
        const toBeDeleted = currentChildren.filter(key => !keys.includes(key))
        for (const key of toBeDeleted)
            await this.removeChild(key, true)

        debug('reloaded %o %o', hasAdditions, toBeDeleted, currentChildren)
        return hasAdditions || !!toBeDeleted.length
    }

    private async processAdded(resource: Resource) {
        const key = Monitor.toKey(resource)
        // I may be a general query so I might get things that
        // aren't me
        if (key !== this.key)
            return await this.addChild(resource, key)
        // It's me!
        this.current = resource as R
        if (await this.onAdded())
            await this.processRefresh()
    }

    private async processModified(resource: Resource) {
        const key = Monitor.toKey(resource)
        // I only deal with me as my children watch themselves
        if (key !== this.key) return

        // I should never get a modified if it's not me
        this.current = resource as R
        if (await this.onModified())
            await this.processRefresh()
    }

    private async processRemoved(resource: Resource) {
        const key = Monitor.toKey(resource)
        // I only deal with me as my children watch themselves
        if (key !== this.key) return

        // I've been removed
        if (this.parent) // Tell my parent to remove me
            await this.parent.removeChild(key)
        else
            await this.stop()
    }

    static toKey(resource: Resource) {
        if (!resource.kind || // Unlikely not to have kind
            !resource.metadata?.namespace ||
            !resource.metadata?.name)
            return 'root-query'

        return [
            resource.kind,
            resource.metadata.namespace,
            resource.metadata.name
        ].join('-')
    }
}
