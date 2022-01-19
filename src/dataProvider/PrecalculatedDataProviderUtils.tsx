import * as React from "react";
import {MetricsFormat} from "./ConfigurationProvider";
import {BYTES_IN_GB, BYTES_IN_KB, BYTES_IN_MB, CYCLES_IN_G, CYCLES_IN_M, CYCLES_IN_T, NO_NUMERIC_VALUE_LABEL} from "./Constants";
import {CalculationUtils} from "../dataProvider/CalculationUtils";

const formatValueWithFormat = (value: number, format: MetricsFormat = "none"): string => {
    switch (format) {
        case "none":
            return value.toString()
        case "cyclesShort": {
            if (value >= CYCLES_IN_T) {
                return `${CalculationUtils.formatSignificantNumericValue(value / CYCLES_IN_T, 3)} T`
            }
            if (value >= CYCLES_IN_G) {
                return `${CalculationUtils.formatSignificantNumericValue(value / CYCLES_IN_G, 3)} G`
            }
            if (value >= CYCLES_IN_M) {
                return `${CalculationUtils.formatSignificantNumericValue(value / CYCLES_IN_M, 3)} M`
            }
            return CalculationUtils.formatSignificantNumericValue(value)
        }
        case "memoryShort": {
            if (value >= BYTES_IN_GB) {
                const gb = (value / BYTES_IN_GB).toFixed(0);
                return `${gb} GB`
            }
            if (value >= BYTES_IN_MB) {
                const mb = (value / BYTES_IN_MB).toFixed(0);
                return `${mb} MB`
            }
            if (value >= BYTES_IN_KB) {
                const kb = (value / BYTES_IN_KB).toFixed(0);
                return `${kb} KB`
            }
            break;
        }
    }
    return NO_NUMERIC_VALUE_LABEL
}

const formatSignificantNumericValue = (value: bigint | number | undefined, format?: MetricsFormat): string => {
    if (value && value > 0) {
        return formatValueWithFormat(typeof value === "bigint" ? Number(value) : value, format)
    }
    return NO_NUMERIC_VALUE_LABEL
}

export const PrecalculatedDataProviderUtils = {
    Formatter: {
        formatValueWithFormat: formatValueWithFormat,
        formatSignificantNumericValue: formatSignificantNumericValue
    }
}