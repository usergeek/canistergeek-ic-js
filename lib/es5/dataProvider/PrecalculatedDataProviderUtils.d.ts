import { MetricsFormat } from "./ConfigurationProvider";
export declare const PrecalculatedDataProviderUtils: {
    Formatter: {
        formatValueWithFormat: (value: number, format?: MetricsFormat) => string;
        formatSignificantNumericValue: (value: bigint | number | undefined, format?: MetricsFormat) => string;
    };
};
