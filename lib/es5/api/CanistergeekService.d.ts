export declare const CanistergeekService: {
    createCanistergeekCanisterActor: (canisterId: string, identity: import("@dfinity/agent").Identity, host: string, httpAgent: import("@dfinity/agent").HttpAgent) => any;
    createBlackholeCanisterActor: () => any;
};
export declare function getCandidOptional<T>(value: [] | [T]): T | undefined;
export declare function createCandidOptional<T>(value?: T): [] | [T];
export declare type ICCanisterQueryResponseError = {
    type: "query";
    props: {
        code?: string;
        message?: string;
        status?: string;
    };
};
export declare type ICCanisterCallResponseError = {
    message: string;
};
export declare const ICCanisterResponseUtil: {
    parseICCanisterResponseQueryError: (e: any) => ICCanisterQueryResponseError | undefined;
    isICCanisterResponseQueryError_NoMethod: (error: ICCanisterQueryResponseError) => boolean;
    parseICCanisterResponseCallError: (e: any) => ICCanisterCallResponseError | undefined;
    isICCanisterResponseCallError_NoUpdateMethod: (error: ICCanisterCallResponseError) => boolean;
};
