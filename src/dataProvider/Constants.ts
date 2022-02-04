export const PRODUCT_NAME = "Canistergeek"

export const GRANULARITY_SECONDS: number = 60 * 5;

export const HOUR_MILLIS: number = 60 * 60 * 1000;
export const DAY_SECONDS: number = 24 * 60 * 60;
export const DAY_MILLIS: number = DAY_SECONDS * 1000;

export const DAY_INTERVALS_COUNT: number = DAY_SECONDS / GRANULARITY_SECONDS;

export const MEMORY_MAX_PER_CANISTER = 2 * 1024 * 1024 * 1024 // 2Gb

export const NO_NUMERIC_VALUE_LABEL = "n/a"
export const NO_OBJECT_VALUE_LABEL = "n/a"

export const BYTES_IN_KB = 1024
export const BYTES_IN_MB = 1024 * BYTES_IN_KB
export const BYTES_IN_GB = 1024 * BYTES_IN_MB

export const CYCLES_IN_K = 1000
export const CYCLES_IN_M = 1000 * CYCLES_IN_K
export const CYCLES_IN_G = 1000 * CYCLES_IN_M
export const CYCLES_IN_T = 1000 * CYCLES_IN_G

export const COLOR_DANGER_HEX = "red"
export const COLOR_GRAY_HEX = "lightgray"