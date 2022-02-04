import * as React from "react";
import {PropsWithChildren, Reducer, useReducer} from "react";
import {useCustomCompareEffect, useCustomCompareMemo} from "use-custom-compare";
import _ from "lodash"
import {ChartJSChartComponentSupplier, ChartJSChartContext} from "./ChartJSChartContext";

export type StateError = {
    error?: Error
    isError: boolean
}

const initialState: ChartJSChartComponentSupplier = {
    isError: false,
    error: undefined,
    chartContext: undefined,
}

export type Context = { state: ChartJSChartComponentSupplier }
const defaultContextValue: Context = {state: initialState}

export const ChartJSComponentSupplierContext = React.createContext<Context>(defaultContextValue);

type ChartJSChartContextProviderFn<D, P> = (data: D, parameters: P) => ChartJSChartContext | undefined
type StateDataTransformFn<D> = (data: D) => any

type Props<D, P> = {
    error?: StateError
    data: D
    parameters: P
    chartContextProviderFn: ChartJSChartContextProviderFn<D, P>
    stateDataTransformFn?: StateDataTransformFn<D>
}

export function ChartJSComponentSupplierProvider<D, P>(props: PropsWithChildren<Props<D, P>>) {

    useCustomCompareEffect(() => {
        // }
        try {
            if (props.error?.isError) {
                setState({
                    isError: props.error.isError,
                    error: props.error.error,
                    chartContext: undefined,
                })
            } else {
                const data = props.data;
                if (data) {
                    const parameters = _.isNil(props.stateDataTransformFn) ? data : props.stateDataTransformFn(data)
                    const chartContext = props.chartContextProviderFn(parameters, props.parameters)
                    setState({
                        isError: false,
                        error: undefined,
                        chartContext: chartContext,
                    })
                } else {
                    setState({
                        isError: false,
                        error: undefined,
                        chartContext: undefined,
                    })
                }
            }
        } catch (e) {
            console.error("ChartJSComponentSupplierProvider calculation failed:", e);
            setState({
                isError: true,
                error: new Error("temporarilyUnavailable"),
                chartContext: undefined,
            })
        }
    }, [props.error, props.data, props.parameters, props.chartContextProviderFn, props.stateDataTransformFn], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })

    const [state, setState] = useReducer<Reducer<ChartJSChartComponentSupplier, Partial<ChartJSChartComponentSupplier>>>(
        (state, newState) => ({...state, ...newState}),
        _.cloneDeep(initialState)
    )
    const value = useCustomCompareMemo<Context, [ChartJSChartComponentSupplier]>(() => ({
        state,
    }), [
        state,
    ], (prevDeps, nextDeps) => {
        return _.isEqual(prevDeps, nextDeps)
    })
    return <ChartJSComponentSupplierContext.Provider value={value}>
        {props.children}
    </ChartJSComponentSupplierContext.Provider>
}