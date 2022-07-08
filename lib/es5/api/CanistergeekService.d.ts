export declare const CanistergeekService: {
    createCanistergeekCanisterActor: (canisterId: string, identity: import("@dfinity/agent").Identity, host: string, httpAgent: import("@dfinity/agent").HttpAgent) => any;
    createBlackholeCanisterActor: () => any;
};
export declare function getCandidOptional<T>(value: [] | [T]): T | undefined;
