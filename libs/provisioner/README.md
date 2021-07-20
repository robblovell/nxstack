# Traxitt Provisioner Service

This module is responsible for dynamically loading and executing provisioners for clients.

Actual provisioner implementations are in the `/packages/provisioners` directory.

## Environment Variables

The following environment variables allow you access to private packages or other registries. Otherwise, https://registry.npmjs.org is used

- NPM_REGISTRY_URL
- NPM_REGISTRY_TOKEN
or optionally:
- NPM_REGISTRY_USERNAME
- NPM_REGISTRY_PASSWORD

## Developing a Provisioner

To create a provisioner you need to create a `spec.yaml` file for your system or a folder with a `traxitt.yaml` file.

The simplest traxitt.yaml spec file would look sometime like this:

```yaml
name: hello-service
version: 0.0.1
description: Test hello service
secretKeyRef: foo
services:
    - hello:
```

Note that the spec files/folder need not be in the project. The `provisioner/samples` directory is there for test provisioner specs.

You then write a provisioner for your service or application based on existing provisioners in `packages/provisioners/{service}` that configures and loads your specs into kubernetes, and ensures they are installed correctly by waiting for certain conditions in the cluster.

For debugging, ensure your `launch.json` file is set up with a kubectl configuration, for example:

```json
{
    "name": "Debug Provision",
    "type": "node",
    "request": "launch",
    "program": "${workspaceFolder}/packages/tools/cli/lib/index.js",
    "sourceMaps": true,
    "args": [
        "provision",
        "packages/provisioner/samples/hello/"
    ],
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen",
    "env": {
        "NODE_ENV": "development",
        "DEBUG": "*,-babel*,-engine*,-live*",
        "KUBECONFIG": "${workspaceFolder}/mike-dev-kubeconfig.yaml"
    }
}
```

Note the `KUBECONFIG` and path to the provisioner spec.

Breakpoints for provisioners go in `packages/provisioner/.provisioner/@provisioner/{service}/src` files (typescript).
