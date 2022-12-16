import { QueryCallRejectedError } from "@dfinity/agent";
export declare const createBlackholeCanisterActor: () => any;
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
    parseICCanisterResponseQueryError: (e: any) => QueryCallRejectedError | undefined;
    isICCanisterResponseQueryError_NoMethod: (error: QueryCallRejectedError | undefined) => boolean;
    parseICCanisterResponseUpdateError: (e: any) => {
        message: string;
    } | undefined;
    isICCanisterResponseUpdateError_NoUpdateMethod: (error: {
        message: string;
    } | undefined) => boolean;
};
