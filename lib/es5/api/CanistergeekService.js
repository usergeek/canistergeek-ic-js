"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandidOptional = exports.CanistergeekService = void 0;
const canistergeek_1 = require("./canistergeek");
const blackhole0_0_0_1 = require("./blackhole0_0_0");
////////////////////////////////////////////////
// Public
////////////////////////////////////////////////
exports.CanistergeekService = {
    createCanistergeekCanisterActor: canistergeek_1.createCanisterActor,
    createBlackholeCanisterActor: blackhole0_0_0_1.createCanisterActor,
};
function getCandidOptional(value) {
    if (value.length == 1) {
        return value[0];
    }
    return undefined;
}
exports.getCandidOptional = getCandidOptional;
//# sourceMappingURL=CanistergeekService.js.map