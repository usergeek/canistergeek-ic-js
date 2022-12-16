import {createCanisterActor as _createBlackholeCanisterActor} from './blackhole0_0_0';
import {hasOwnProperty} from "../util/typescriptAddons";
import {ActorCallError, QueryCallRejectedError} from "@dfinity/agent";

////////////////////////////////////////////////
// Public
////////////////////////////////////////////////

export const createBlackholeCanisterActor = _createBlackholeCanisterActor

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

    ////////////////////////////////////////////////
    // Query
    ////////////////////////////////////////////////

    const parseICCanisterResponseQueryError = (e: any): QueryCallRejectedError | undefined => {
        if (e != undefined) {
            const agentError: ActorCallError = e as ActorCallError
            if (agentError != undefined && agentError.type === "query") {
                return agentError as QueryCallRejectedError
            }
        }
        return undefined
    }

    const isICCanisterResponseQueryError = (error: QueryCallRejectedError, errorCode: string): boolean => {
        const keyValue: string | undefined = error.props?.Message || error.props?.message
        return keyValue != undefined ? keyValue.indexOf(errorCode) > -1 : false;
    }

    const isICCanisterResponseQueryError_NoMethod = (error: QueryCallRejectedError | undefined): boolean => {
        if (error != undefined) {
            return isICCanisterResponseQueryError(error, ErrorCode.noMethod)
        }
        return false
    }

    ////////////////////////////////////////////////
    // Update
    ////////////////////////////////////////////////

    const parseICCanisterResponseUpdateError = (e: any): {message: string} | undefined => {
        if (e) {
            if (hasOwnProperty(e, "message")) {
                return {
                    message: `${e.message}`
                }
            }
        }
        return undefined
    }

    const isICCanisterResponseUpdateError_NoUpdateMethod = (error: {message: string} | undefined): boolean => {
        if (error != undefined) {
            const isRejectCode3 = error.message.indexOf("Reject code: 3") > -1
            if (isRejectCode3) {
                const isNoUpdateMethodError = error.message.indexOf("has no update method") > -1
                if (isNoUpdateMethodError) {
                    return true
                }
            }
        }
        return false
    }

    return {
        parseICCanisterResponseQueryError: parseICCanisterResponseQueryError,
        isICCanisterResponseQueryError_NoMethod: isICCanisterResponseQueryError_NoMethod,
        parseICCanisterResponseUpdateError: parseICCanisterResponseUpdateError,
        isICCanisterResponseUpdateError_NoUpdateMethod: isICCanisterResponseUpdateError_NoUpdateMethod,
    }
})()