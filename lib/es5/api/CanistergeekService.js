"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICCanisterResponseUtil = exports.createCandidOptional = exports.getCandidOptional = exports.createBlackholeCanisterActor = void 0;
const blackhole0_0_0_1 = require("./blackhole0_0_0");
const typescriptAddons_1 = require("../util/typescriptAddons");
////////////////////////////////////////////////
// Public
////////////////////////////////////////////////
exports.createBlackholeCanisterActor = blackhole0_0_0_1.createCanisterActor;
function getCandidOptional(value) {
    if (value.length == 1) {
        return value[0];
    }
    return undefined;
}
exports.getCandidOptional = getCandidOptional;
function createCandidOptional(value) {
    return value != undefined ? [value] : [];
}
exports.createCandidOptional = createCandidOptional;
exports.ICCanisterResponseUtil = (() => {
    const ErrorCode = {
        noMethod: "IC0302"
    };
    ////////////////////////////////////////////////
    // Query
    ////////////////////////////////////////////////
    const parseICCanisterResponseQueryError = (e) => {
        if (e != undefined) {
            const agentError = e;
            if (agentError != undefined && agentError.type === "query") {
                return agentError;
            }
        }
        return undefined;
    };
    const isICCanisterResponseQueryError = (error, errorCode) => {
        var _a, _b;
        const keyValue = ((_a = error.props) === null || _a === void 0 ? void 0 : _a.Message) || ((_b = error.props) === null || _b === void 0 ? void 0 : _b.message);
        return keyValue != undefined ? keyValue.indexOf(errorCode) > -1 : false;
    };
    const isICCanisterResponseQueryError_NoMethod = (error) => {
        if (error != undefined) {
            return isICCanisterResponseQueryError(error, ErrorCode.noMethod);
        }
        return false;
    };
    ////////////////////////////////////////////////
    // Update
    ////////////////////////////////////////////////
    const parseICCanisterResponseUpdateError = (e) => {
        if (e) {
            if ((0, typescriptAddons_1.hasOwnProperty)(e, "message")) {
                return {
                    message: `${e.message}`
                };
            }
        }
        return undefined;
    };
    const isICCanisterResponseUpdateError_NoUpdateMethod = (error) => {
        if (error != undefined) {
            const isRejectCode3 = error.message.indexOf("Reject code: 3") > -1;
            if (isRejectCode3) {
                const isNoUpdateMethodError = error.message.indexOf("has no update method") > -1;
                if (isNoUpdateMethodError) {
                    return true;
                }
            }
        }
        return false;
    };
    return {
        parseICCanisterResponseQueryError: parseICCanisterResponseQueryError,
        isICCanisterResponseQueryError_NoMethod: isICCanisterResponseQueryError_NoMethod,
        parseICCanisterResponseUpdateError: parseICCanisterResponseUpdateError,
        isICCanisterResponseUpdateError_NoUpdateMethod: isICCanisterResponseUpdateError_NoUpdateMethod,
    };
})();
//# sourceMappingURL=CanistergeekService.js.map