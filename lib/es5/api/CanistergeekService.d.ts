export declare const CanistergeekService: {
    createCanistergeekCanisterActor: (canisterId: string, identity: import("@dfinity/agent").Identity, host: string) => any;
    createBlackholeCanisterActor: (identity: import("@dfinity/agent").Identity) => any;
};
export declare function getCandidOptional<T>(value: [] | [T]): T | undefined;
