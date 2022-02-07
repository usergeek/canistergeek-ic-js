import {createCanisterActor as createCanistergeekCanisterActor} from './canistergeek';
import {createCanisterActor as createBlackholeCanisterActor} from './blackhole0_0_0';

////////////////////////////////////////////////
// Public
////////////////////////////////////////////////

export const CanistergeekService = {
    createCanistergeekCanisterActor: createCanistergeekCanisterActor,
    createBlackholeCanisterActor: createBlackholeCanisterActor,
}