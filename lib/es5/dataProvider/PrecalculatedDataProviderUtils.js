"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecalculatedDataProviderUtils = void 0;
const Constants_1 = require("./Constants");
const CalculationUtils_1 = require("../dataProvider/CalculationUtils");
const formatValueWithFormat = (value, format = "none") => {
    switch (format) {
        case "none":
            return value.toString();
        case "cyclesShort": {
            if (value >= Constants_1.CYCLES_IN_T) {
                return `${CalculationUtils_1.CalculationUtils.formatSignificantNumericValue(value / Constants_1.CYCLES_IN_T, 3)} T`;
            }
            if (value >= Constants_1.CYCLES_IN_G) {
                return `${CalculationUtils_1.CalculationUtils.formatSignificantNumericValue(value / Constants_1.CYCLES_IN_G, 3)} G`;
            }
            if (value >= Constants_1.CYCLES_IN_M) {
                return `${CalculationUtils_1.CalculationUtils.formatSignificantNumericValue(value / Constants_1.CYCLES_IN_M, 3)} M`;
            }
            return CalculationUtils_1.CalculationUtils.formatSignificantNumericValue(value);
        }
        case "memoryShort": {
            if (value >= Constants_1.BYTES_IN_GB) {
                const gb = (value / Constants_1.BYTES_IN_GB).toFixed(0);
                return `${gb} GB`;
            }
            if (value >= Constants_1.BYTES_IN_MB) {
                const mb = (value / Constants_1.BYTES_IN_MB).toFixed(0);
                return `${mb} MB`;
            }
            if (value >= Constants_1.BYTES_IN_KB) {
                const kb = (value / Constants_1.BYTES_IN_KB).toFixed(0);
                return `${kb} KB`;
            }
            break;
        }
    }
    return Constants_1.NO_NUMERIC_VALUE_LABEL;
};
const formatSignificantNumericValue = (value, format) => {
    if (value && value > 0) {
        return formatValueWithFormat(typeof value === "bigint" ? Number(value) : value, format);
    }
    return Constants_1.NO_NUMERIC_VALUE_LABEL;
};
exports.PrecalculatedDataProviderUtils = {
    Formatter: {
        formatValueWithFormat: formatValueWithFormat,
        formatSignificantNumericValue: formatSignificantNumericValue
    }
};
//# sourceMappingURL=PrecalculatedDataProviderUtils.js.map