
import { BaseNamespaceHelper } from './base'

export class ProjectNamespaceHelper extends BaseNamespaceHelper {
    get type() { return 'project' }
    get typeDisplay() { return 'Project' }
}