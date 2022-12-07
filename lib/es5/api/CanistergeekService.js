"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICCanisterResponseUtil = exports.createCandidOptional = exports.getCandidOptional = exports.CanistergeekService = void 0;
const canistergeek_1 = require("./canistergeek");
const blackhole0_0_0_1 = require("./blackhole0_0_0");
const typescriptAddons_1 = require("../util/typescriptAddons");
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
function createCandidOptional(value) {
    return value != undefined ? [value] : [];
}
exports.createCandidOptional = createCandidOptional;
exports.ICCanisterResponseUtil = (() => {
    const ErrorCode = {
        noMethod: "IC0302"
    };
    const parseICCanisterResponseQueryError = (e) => {
        if (e) {
            if ((0, typescriptAddons_1.hasOwnProperty)(e, "type")) {
                if (e.type === "query") {
                    if ((0, typescriptAddons_1.hasOwnProperty)(e, "props")) {
                        const props = e.props;
                        return {
                            type: "query",
                            props: {
                                code: props.Code,
                                message: props.Message,
                                status: props.Status,
                            }
                        };
                    }
                }
            }
        }
        return undefined;
    };
    const isICCanisterResponseQueryError = (error, errorCode) => {
        return error.props.message ? error.props.message.indexOf(errorCode) > -1 : false;
    };
    const isICCanisterResponseQueryError_NoMethod = (error) => {
        return isICCanisterResponseQueryError(error, ErrorCode.noMethod);
    };
    const parseICCanisterResponseCallError = (e) => {
        if (e) {
            if ((0, typescriptAddons_1.hasOwnProperty)(e, "message")) {
                return {
                    message: `${e.message}`
                };
            }
        }
        return undefined;
    };
    const isICCanisterResponseCallError_NoUpdateMethod = (error) => {
        console.log("isICCanisterResponseCallError_NoUpdateMethod: error.message.indexOf(\"Reject code: 3\")", error.message.indexOf("Reject code: 3"));
        console.log("isICCanisterResponseCallError_NoUpdateMethod: error.message.indexOf(\"has no update method\")", error.message.indexOf("has no update method"));
        const isRejectCode3 = error.message.indexOf("Reject code: 3") > -1;
        if (isRejectCode3) {
            const isNoUpdateMethodError = error.message.indexOf("has no update method") > -1;
            if (isNoUpdateMethodError) {
                return true;
            }
        }
        return false;
    };
    return {
        parseICCanisterResponseQueryError: parseICCanisterResponseQueryError,
        isICCanisterResponseQueryError_NoMethod: isICCanisterResponseQueryError_NoMethod,
        parseICCanisterResponseCallError: parseICCanisterResponseCallError,
        isICCanisterResponseCallError_NoUpdateMethod: isICCanisterResponseCallError_NoUpdateMethod,
    };
})();
//# sourceMappingURL=CanistergeekService.js.map