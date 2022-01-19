"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanistergeekService = void 0;
const canistergeek_1 = require("./canistergeek");
const getMetricsGranularity = (value) => {
    switch (value) {
        case "hourly":
            return { hourly: null };
        default:
            return { daily: null };
    }
};
////////////////////////////////////////////////
// Public
////////////////////////////////////////////////
const getCanisterMetrics = async ({ actor, granularity, dateFromMillis, dateToMillis }) => {
    const canisterMetrics = await actor.getCanisterMetrics({
        granularity: getMetricsGranularity(granularity),
        dateFromMillis: BigInt(dateFromMillis),
        dateToMillis: BigInt(dateToMillis),
    });
    if (canisterMetrics.length > 0) {
        return canisterMetrics[0];
    }
};
exports.CanistergeekService = {
    createCanisterActor: canistergeek_1.createCanisterActor,
    getCanisterMetrics: getCanisterMetrics
};
//# sourceMappingURL=CanistergeekService.js.map