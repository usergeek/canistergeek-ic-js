import _ from "lodash";
import {NO_NUMERIC_VALUE_LABEL} from "./Constants";

const sumArray = (values: Array<bigint> | undefined): number => {
    return _.sumBy(values, value => Number(value))
}

/**
 * @param {Array<bigint> | undefined} values
 * @return difference between first and last positive values in passed array.
 * @example Having array [0,0,1,0,0,4,0] returns 3
 */
const findDifferenceAsNumber = (values: Array<bigint> | undefined): bigint => {
    if (!values) {
        return BigInt(0)
    }
    let firstSignificantValue = BigInt(0);
    let lastSignificantValue = BigInt(0);
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (value > 0) {
            firstSignificantValue = value
            break
        }
    }
    for (let i = values.length - 1; i >= 0; i--) {
        const value = values[i];
        if (value > 0) {
            lastSignificantValue = value
            break
        }
    }
    return lastSignificantValue - firstSignificantValue;
}

const formatSignificantValue = (value?: bigint | number, decimals: number = 0): string => {
    if (value && value > 0) {
        return formatNumericValue(value, decimals)
    }
    return NO_NUMERIC_VALUE_LABEL
}

const intlFormatNumber = (value: bigint | number, maximumFractionDigits: number = 0, thousandsSeparator: string = ""): string => {
    const parts = Intl.NumberFormat('en-US', {maximumFractionDigits: maximumFractionDigits}).formatToParts(value)
    _.each(parts, part => {
        switch (part.type as Intl.NumberFormatPartTypes) {
            case "group": {
                part.value = thousandsSeparator
                break;
            }
            case "decimal": {
                part.value = "."
                break;
            }
        }
    })
    return parts.map(v => v.value).join("")
}

/**
 * Format a number and return a string based on passed number of fraction digits.
 * Thousands separator is space " "
 * @param {bigint | number} value
 * @param {number | 0} maximumFractionDigits maximum number of fraction digits
 * @return Formatted number
 * @example having value `9999999.6666` and decimals `3` will output string `"9 999 999.667"`
 */
const formatNumericValue = (value: bigint | number, maximumFractionDigits: number = 0): string => {
    return intlFormatNumber(value, maximumFractionDigits, " ")
}

const formatSignificantSumArray = (values: Array<bigint> | undefined): string => {
    const sum = sumArray(values)
    return formatSignificantValue(sum)
}

const recalculateCyclesToDollars = (value?: bigint | number): number => {
    if (value) {
        return Number(value) * 1.45 / 1_000_000_000_000;
    }
    return 0;
}

const recalculateCyclesToDollarsFormatted = (value?: bigint | number): string => {
    const dollars = recalculateCyclesToDollars(value);
    if (dollars && dollars !== 0) {
        return intlFormatNumber(dollars, 4) + "$"
    }
    return "0$"
}

export const CalculationUtils = {
    formatNumericValue: formatNumericValue,
    formatSignificantNumericValue: formatSignificantValue,
    formatSignificantSumArray: formatSignificantSumArray,
    sumArray: sumArray,
    findDifferenceAsNumber: findDifferenceAsNumber,
    recalculateCyclesToDollars: recalculateCyclesToDollars,
    recalculateCyclesToDollarsFormatted: recalculateCyclesToDollarsFormatted,
    jsonStringifyWithBigInt: (value: any) => JSON.stringify(value, (key, value) =>
        typeof value === "bigint" ? value.toString() + "n" : value
    ),
    jsonParseWithBigInt: (value: string) => JSON.parse(value, (key, value) => {
        if (typeof value === "string" && /^\d+n$/.test(value)) {
            return BigInt(value.substr(0, value.length - 1));
        }
        return value;
    }),
}