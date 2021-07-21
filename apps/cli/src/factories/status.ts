import { CLIReporter } from '../ui/display/cliReporter'
import { ProvisionerManager } from '@c6o/provisioner'
import { CLIStatus } from '../ui'
import { Reporter } from '../ui/display'

// getStatus creates and returns a new CLIStatus instance which can be used to create output stages.
// Note that every instance of CLIStatus will have a root, top-level stage under which all the
// subsequent pushes to the stack will appear.
export const getStatus = (reporter: Reporter, manager?: ProvisionerManager): CLIStatus => new CLIStatus(reporter as CLIReporter, manager)
