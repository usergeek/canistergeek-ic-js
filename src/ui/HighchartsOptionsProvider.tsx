import * as React from "react";
import {PropsWithChildren, Reducer, useReducer} from "react";
import Highcharts from "highcharts";
import {useCustomCompareEffect, useCustomCompareMemo} from "use-custom-compare";
import _ from "lodash"

export type StateError = {
    error?: Error
    isError: boolean
}

export type HighchartsOptionsState = {
    isError: boolean
    error?: Error
    options: Highcharts.Options,
}

const initialState: HighchartsOptionsState = {
    isError: false,
    error: undefined,
    options: {},
}

export type Context = { state: HighchartsOptionsState }
const defaultContextValue: Context = {state: initialState}

export const HighchartsOptionsContext = React.createContext<Context>(defaultContextValue);

type HighchartsOptionsProviderFn<D, P> = (data: D, parameters: P) => Highcharts.Options
type StateDataTransformFn<D> = (data: D) => any

type Props<D, P> = {
    error?: StateError
    data: D
    parameters: P
    highchartsOptionsProviderFn: HighchartsOptionsProviderFn<D, P>
    stateDataTransformFn?: StateDataTransformFn<D>
}

export function HighchartsOptionsProvider<D, P>(props: PropsWithChildren<Props<D, P>>) {

    useCustomCompareEffect(() => {
        // }
        try {
            if (props.error?.isError) {
                setState({
                    isError: props.error.isError,
                    error: props.error.error,
                    options: {},
                })
            } else {
                const data = props.data;
                if (data) {
                    const parameters = _.isNil(props.stateDataTransformFn) ? data : props.stateDataTransformFn(data)
                    const options = props.highchartsOptionsProviderFn(parameters, props.parameters)
                    if (options.exporting) {
                        options.exporting.enabled = false
                    }
                    setState({
                        isError: false,
                        error: undefined,
                        options: options,
                    })
                } else {
                    setState({
                        isError: false,
                        error: undefined,
                        options: {},
                    })
                }
            }
        } catch (e) {
            console.error("HighchartsOptionsProvider calculation failed:", e);
            setState({
                isError: true,
                error: new Error("temporarilyUnavailable"),
                options: {},
            })
        }
    }, [props.error, props.data, props.parameters, props.highchartsOptionsProviderFn, props.stateDataTransformFn], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })

    const [state, setState] = useReducer<Reducer<HighchartsOptionsState, Partial<HighchartsOptionsState>>>(
        (state, newState) => ({...state, ...newState}),
        _.cloneDeep(initialState)
    )
    const value = useCustomCompareMemo<Context, [HighchartsOptionsState]>(() => ({
        state,
    }), [
        state,
    ], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })
    return <HighchartsOptionsContext.Provider value={value}>
        {props.children}
    </HighchartsOptionsContext.Provider>
}