import {ActorSubclass} from "@dfinity/agent";
import {_SERVICE, CanisterMetrics, MetricsGranularity,} from './canistergeek.did';
import {createCanisterActor} from './canistergeek';

type Granularity = "hourly" | "daily"

type CanisterMetricsParams = {
    actor: ActorSubclass<_SERVICE>
    granularity: Granularity
    dateFromMillis: number
    dateToMillis: number
}

const getMetricsGranularity = (value: Granularity): MetricsGranularity => {
    switch (value) {
        case "hourly":
            return {hourly: null}
        default:
            return {daily: null}
    }
}

////////////////////////////////////////////////
// Public
////////////////////////////////////////////////

const getCanisterMetrics = async ({actor, granularity, dateFromMillis, dateToMillis}: CanisterMetricsParams): Promise<CanisterMetrics | undefined> => {
    const canisterMetrics = await actor.getCanisterMetrics({
        granularity: getMetricsGranularity(granularity),
        dateFromMillis: BigInt(dateFromMillis),
        dateToMillis: BigInt(dateToMillis),
    });
    if (canisterMetrics.length > 0) {
        return canisterMetrics[0]
    }
}

export const CanistergeekService = {
    createCanisterActor: createCanisterActor,
    getCanisterMetrics: getCanisterMetrics
}