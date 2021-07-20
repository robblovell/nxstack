export declare function getTimeZonesFlatten(): Generator<{
    value: string;
    name: string;
}, void, unknown>;
export declare function getTimeZones(): {
    group: string;
    zones: {
        value: string;
        name: string;
    }[];
}[];
