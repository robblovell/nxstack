import { BaseCommand } from './base'
import { kubeconfigFlag, namespaceFlag } from './flags'

export abstract class KubernetesCommand {

    static flags = {
        ...BaseCommand.flags,
        ...kubeconfigFlag(),
    }

    static flagMaps = {
        ...BaseCommand.flagMaps,
    }
}

export abstract class KubernetesNamespacedCommand extends KubernetesCommand{

    static flags = {
        ...KubernetesCommand.flags,
        ...namespaceFlag()
    }

    static flagMaps = {
        ...KubernetesCommand.flagMaps,
    }
}