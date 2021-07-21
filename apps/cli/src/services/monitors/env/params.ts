import { SessionParams } from '../../params'
import { MonitorParams } from '../params'

export interface EnvMonitorParams extends MonitorParams, SessionParams {
    envFile?: string
    format?: 'sh' | 'env' | 'json' | 'yaml'
}