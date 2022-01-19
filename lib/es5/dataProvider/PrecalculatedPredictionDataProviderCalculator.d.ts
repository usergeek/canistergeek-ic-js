import { PrecalculatedData } from "./PrecalculatedPredictionDataProvider";
import { ContextDataHourly } from "./DataProvider";
import { Configuration } from "./ConfigurationProvider";
export declare const PrecalculatedPredictionDataProviderCalculator: {
    getPrecalculatedData: (dataHourly: ContextDataHourly, configuration: Configuration) => PrecalculatedData;
};
