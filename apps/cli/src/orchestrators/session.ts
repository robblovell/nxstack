import { SessionDescription } from '../services/session'
import { Orchestrator } from './base'
import { createDebug } from '@c6o/logger'
import { Factory } from './factory'
import { OrchestratorParams } from './params'
import { Session } from '../services/session'
import { ClusterSessionParams } from '../services'
import { Kubernetes } from './kubernetes'
import { FileSessionStorage } from '../services/session/storage/file'
import { ClusterSessionStorage } from '../services/session/storage/cluster'

const debug = createDebug()

export interface SessionOrchestratorParams extends OrchestratorParams, ClusterSessionParams {
    session?: SessionDescription

    // List flags
    detail?: boolean

    // Close flags
    purge?: boolean
    all?: boolean
}

export class SessionOrchestrator extends Orchestrator<SessionOrchestratorParams> {

    async apply() {
        throw new Error('Session orchestrator does not do apply')
    }

    async listSessions() {
        await Kubernetes.ensureCluster(this.params)

        const sessions = await FileSessionStorage.list()
        debug('Sessions %o', sessions)
        if (sessions.length) {
            this.UI.list(sessions,
                'display', 'The following local sessions are active:')
            this.UI.reporter.newline()
        }
        else
            this.params.status?.warn('No active local sessions')

        const clusterSessions = await ClusterSessionStorage.list(this.params)
        if (clusterSessions.length) {
            const metadata = clusterSessions.map(session => session.metadata.name)
            this.UI.listStrings(metadata,
                'The following cluster sessions are active:')
        }
        else
            this.params.status?.warn('No active cluster sessions')

        if (this.params.detail) {
            const detailSessions = await Session.subSessionList(this.params)
            this.UI.reporter.newline()
            const displayValues = detailSessions.map(details => details.substring(0, details.length - '.json'.length))
            this.UI.listStrings(displayValues, 'The following sub-sessions files remain:', 'warn')
        }
    }

    async closeSession() {
        await Kubernetes.ensureCluster(this.params)
        if (this.params.purge)
            return await this.purge()

        const sessions = await FileSessionStorage.list()
        debug('Sessions %o', sessions)

        if (this.params.all) {
            for(const session of sessions) {
                await this.close(session)
                this.UI.reporter.newline()
            }

            if (sessions.length)
                return
        }
        else {
            const result = await this.UI.selectOne(
                sessions,
                'Select a session to close',
                'session',
                'display')

            if (result.session)
                return await this.close(result.session)
        }

        this.params.status?.warn('No active sessions found')
    }

    private async close(session: SessionDescription) {
        this.UI.reporter.print(`Closing session ${session.display}`, 'highlight')
        this.UI.reporter.newline()
        const orchestrator = this.orchestratorFromSession(session)
        await orchestrator.apply()
    }

    private async purge() {
        const result = await this.UI.confirm(
            'Are you sure you want to purge sessions? You will have to manually clean-up session residue', false)
        if (!result) return

        this.UI.reporter.newline()
        this.params.status?.push('Purging all session data')
        try {
            await Session.purge(this.params)
        }
        catch(err) { this.params.status?.error(err) }
        finally { this.params.status?.pop() }
    }

    private orchestratorFromSession(description: SessionDescription) {
        const orchestrationFactory = Factory[description.handler]

        if (orchestrationFactory === undefined || orchestrationFactory === null)
            throw new Error(`Factory does not contain '${description.handler}'`)

        const params = description.cleanUpParams
        params.status = this.params.status
        return orchestrationFactory(params) as Orchestrator
    }
}
