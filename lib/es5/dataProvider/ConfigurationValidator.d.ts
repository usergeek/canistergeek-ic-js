export declare type ConfigurationValidationResult = {
    valid: boolean;
    error?: Error;
};
export declare const ConfigurationValidator: {
    validateConfiguration: (value: any) => ConfigurationValidationResult;
};
