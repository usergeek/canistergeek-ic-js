export declare type CGStatus = {
    inProgress: boolean;
    loaded: boolean;
};
export declare type CGStatusByKey = {
    [key: string]: CGStatus;
};
export declare type CGError = {
    isError: boolean;
    error?: Error;
};
export declare type CGErrorByKey = {
    [key: string]: CGError;
};
