import {createCanisterActor as createCanistergeekCanisterActor} from './canistergeek';
import {createCanisterActor as createBlackholeCanisterActor} from './blackhole0_0_0';
import {hasOwnProperty} from "../util/typescriptAddons";

////////////////////////////////////////////////
// Public
////////////////////////////////////////////////

export const CanistergeekService = {
    createCanistergeekCanisterActor: createCanistergeekCanisterActor,
    createBlackholeCanisterActor: createBlackholeCanisterActor,
}

export function getCandidOptional<T>(value: [] | [T]): T | undefined {
    if (value.length == 1) {
        return value[0]
    }
    return undefined
}

export function createCandidOptional<T>(value?: T): [] | [T] {
    return value != undefined ? [value] : []
}

export type ICCanisterQueryResponseError = {
    type: "query"
    props: {
        code?: string
        message?: string
        status?: string
    }
}

export type ICCanisterCallResponseError = {
    message: string
}

export const ICCanisterResponseUtil = (() => {
    const ErrorCode = {
        noMethod: "IC0302"
    }

    const parseICCanisterResponseQueryError = (e: any): ICCanisterQueryResponseError | undefined => {
        if (e) {
            if (hasOwnProperty(e, "type")) {
                if (e.type === "query") {
                    if (hasOwnProperty(e, "props")) {
                        const props = e.props;
                        return {
                            type: "query",
                            props: {
                                code: props.Code,
                                message: props.Message,
                                status: props.Status,
                            }
                        }
                    }
                }
            }
        }
        return undefined
    }

    const isICCanisterResponseQueryError = (error: ICCanisterQueryResponseError, errorCode: string): boolean => {
        return error.props.message ? error.props.message.indexOf(errorCode) > -1 : false;
    }

    const isICCanisterResponseQueryError_NoMethod = (error: ICCanisterQueryResponseError): boolean => {
        return isICCanisterResponseQueryError(error, ErrorCode.noMethod)
    }

    const parseICCanisterResponseCallError = (e: any): ICCanisterCallResponseError | undefined => {
        if (e) {
            if (hasOwnProperty(e, "message")) {
                return {
                    message: `${e.message}`
                }
            }
        }
        return undefined
    }

    const isICCanisterResponseCallError_NoUpdateMethod = (error: ICCanisterCallResponseError): boolean => {
        console.log("isICCanisterResponseCallError_NoUpdateMethod: error.message.indexOf(\"Reject code: 3\")", error.message.indexOf("Reject code: 3"));
        console.log("isICCanisterResponseCallError_NoUpdateMethod: error.message.indexOf(\"has no update method\")", error.message.indexOf("has no update method"));
        const isRejectCode3 = error.message.indexOf("Reject code: 3") > -1
        if (isRejectCode3) {
            const isNoUpdateMethodError = error.message.indexOf("has no update method") > -1
            if (isNoUpdateMethodError) {
                return true
            }
        }
        return false
    }

    return {
        parseICCanisterResponseQueryError: parseICCanisterResponseQueryError,
        isICCanisterResponseQueryError_NoMethod: isICCanisterResponseQueryError_NoMethod,
        parseICCanisterResponseCallError: parseICCanisterResponseCallError,
        isICCanisterResponseCallError_NoUpdateMethod: isICCanisterResponseCallError_NoUpdateMethod,
    }
})()