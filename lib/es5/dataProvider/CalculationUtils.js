"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationUtils = void 0;
const lodash_1 = __importDefault(require("lodash"));
const Constants_1 = require("./Constants");
const sumArray = (values) => {
    return lodash_1.default.sumBy(values, value => Number(value));
};
/**
 * @param {Array<bigint> | undefined} values
 * @return difference between first and last positive values in passed array.
 * @example Having array [0,0,1,0,0,4,0] returns 3
 */
const findDifferenceAsNumber = (values) => {
    if (!values) {
        return BigInt(0);
    }
    let firstSignificantValue = BigInt(0);
    let lastSignificantValue = BigInt(0);
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (value > 0) {
            firstSignificantValue = value;
            break;
        }
    }
    for (let i = values.length - 1; i >= 0; i--) {
        const value = values[i];
        if (value > 0) {
            lastSignificantValue = value;
            break;
        }
    }
    return lastSignificantValue - firstSignificantValue;
};
const formatSignificantValue = (value, decimals = 0) => {
    if (value && value > 0) {
        return formatNumericValue(value, decimals);
    }
    return Constants_1.NO_NUMERIC_VALUE_LABEL;
};
const intlFormatNumber = (value, maximumFractionDigits = 0, thousandsSeparator = "") => {
    const parts = Intl.NumberFormat('en-US', { maximumFractionDigits: maximumFractionDigits }).formatToParts(value);
    lodash_1.default.each(parts, part => {
        switch (part.type) {
            case "group": {
                part.value = thousandsSeparator;
                break;
            }
            case "decimal": {
                part.value = ".";
                break;
            }
        }
    });
    return parts.map(v => v.value).join("");
};
/**
 * Format a number and return a string based on passed number of fraction digits.
 * Thousands separator is space " "
 * @param {bigint | number} value
 * @param {number | 0} maximumFractionDigits maximum number of fraction digits
 * @return Formatted number
 * @example having value `9999999.6666` and decimals `3` will output string `"9 999 999.667"`
 */
const formatNumericValue = (value, maximumFractionDigits = 0) => {
    return intlFormatNumber(value, maximumFractionDigits, " ");
};
const formatSignificantSumArray = (values) => {
    const sum = sumArray(values);
    return formatSignificantValue(sum);
};
const recalculateCyclesToDollars = (value) => {
    if (value) {
        return Number(value) * 1.45 / 1000000000000;
    }
    return 0;
};
const recalculateCyclesToDollarsFormatted = (value) => {
    const dollars = recalculateCyclesToDollars(value);
    if (dollars && dollars !== 0) {
        return intlFormatNumber(dollars, 4) + "$";
    }
    return "0$";
};
exports.CalculationUtils = {
    formatNumericValue: formatNumericValue,
    formatSignificantNumericValue: formatSignificantValue,
    formatSignificantSumArray: formatSignificantSumArray,
    sumArray: sumArray,
    findDifferenceAsNumber: findDifferenceAsNumber,
    recalculateCyclesToDollars: recalculateCyclesToDollars,
    recalculateCyclesToDollarsFormatted: recalculateCyclesToDollarsFormatted,
    jsonStringifyWithBigInt: (value, space) => JSON.stringify(value, (key, value) => typeof value === "bigint" ? value.toString() + "n" : value, space),
    jsonParseWithBigInt: (value) => JSON.parse(value, (key, value) => {
        if (typeof value === "string" && /^\d+n$/.test(value)) {
            return BigInt(value.substr(0, value.length - 1));
        }
        return value;
    }),
};
//# sourceMappingURL=CalculationUtils.js.map