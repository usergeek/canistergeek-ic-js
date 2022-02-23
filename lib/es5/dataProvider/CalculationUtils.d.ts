export declare const CalculationUtils: {
    formatNumericValue: (value: bigint | number, maximumFractionDigits?: number) => string;
    formatSignificantNumericValue: (value?: bigint | number, decimals?: number) => string;
    formatSignificantSumArray: (values: Array<bigint> | undefined) => string;
    sumArray: (values: Array<bigint> | undefined) => number;
    findDifferenceAsNumber: (values: Array<bigint> | undefined) => bigint;
    recalculateCyclesToDollars: (value?: bigint | number) => number;
    recalculateCyclesToDollarsFormatted: (value?: bigint | number) => string;
    jsonStringifyWithBigInt: (value: any, space?: string | number) => string;
    jsonParseWithBigInt: (value: string) => any;
};
