export declare abstract class KubernetesCommand {
    static flags: {
        kubeconfig: import("@oclif/command/lib/flags").IOptionFlag<string[]>;
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        demo: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-input': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        quiet: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static flagMaps: {
        'dry-run': string;
        'no-input': string;
    };
}
export declare abstract class KubernetesNamespacedCommand extends KubernetesCommand {
    static flags: {
        namespace: import("@oclif/command/lib/flags").IOptionFlag<string[]>;
        kubeconfig: import("@oclif/command/lib/flags").IOptionFlag<string[]>;
        'dry-run': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        demo: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'no-input': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        quiet: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static flagMaps: {
        'dry-run': string;
        'no-input': string;
    };
}
