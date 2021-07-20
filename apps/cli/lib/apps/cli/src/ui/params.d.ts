import { Status } from '@c6o/kubeclient-contracts';
export interface TerminalUIParams {
    status?: Status;
    demo?: boolean;
    noInput?: boolean;
    quiet?: boolean;
}
