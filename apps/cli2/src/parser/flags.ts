import { flags } from '@oclif/command'

export const kubeconfigFlag = (opts?) => ({
    kubeconfig: flags.string({
        char: 'k',
        description: 'Path to a specific the kubeconfig file to use for cluster credentials',
        env: 'KUBECONFIG',
        ...opts
    })
})

export const namespaceFlag = (opts?) => {
    return ({
        namespace: flags.string({
            char: 'n',
            description: 'Namespace for the operation',
            ...opts
        })
    })
}

export const sessionFlags = (cleanOpts?, backgroundOpts?) => ({
    clean: flags.boolean({char: 'c', description: 'Close and clean up', ...cleanOpts}),
    wait: flags.boolean({char: 'w', description: 'Wait for terminate signal and then clean up', ...backgroundOpts }),
})