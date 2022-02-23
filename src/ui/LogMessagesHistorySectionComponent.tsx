import * as React from "react";
import {ChangeEvent, Reducer, useCallback, useReducer, useState} from "react";
import {CanisterId, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {CHUNK_SIZE_FROM_EACH_CANISTER, DEFAULT_DATE_FORMAT_STRING, DEFAULT_LINE_FORMAT_STRING, formatLine, LINE_FILTER_MAX_LENGTH} from "./LogMessagesRealtimeSectionComponent";
import {Identity} from "@dfinity/agent";
import _ from "lodash";
import {PageContent} from "./PageContent";
import {Col, DatePicker, Form, Input, Result, Row} from "antd";
import {ShowButton} from "./ShowButton";
import {LineFormatFn, LogMessagesList} from "./LogMessagesList";
import Moment, {Moment as MomentType} from "moment";
import {useCustomCompareCallback, useCustomCompareMemo} from "use-custom-compare";
import {GetLogMessagesFilter, GetLogMessagesParameters, Nanos} from "../api/canistergeek.did";
import {unstable_batchedUpdates} from "react-dom";
import {GetLogMessagesCanisterContextMessages, GetLogMessagesFnParameters, GetLogMessagesFnResultListItem, InfoDataByCanister, useLogMessagesDataContext} from "../dataProvider/LogMessagesDataProvider";
import {DisabledTimes} from "rc-picker/lib/interface";
import {DateTimeUtils} from "./DateTimeUtils";
import {LogMessagesCanistersMultiSelect} from "./LogMessagesCanistersMultiSelect";
import {useURLPathContext} from "./URLPathProvider";
import {CGError, CGErrorByKey, CGStatus} from "../dataProvider/Commons";

type FetchLogMessagesFnParams = {
    getLogMessagesParameters: GetLogMessagesFnParameters<GetLogMessagesCanisterContextMessages>
    replaceListItems: boolean
}
type FetchLogMessagesFn = (parameters: FetchLogMessagesFnParams) => void

type Props = {
    identity?: Identity
    host?: string
}

export const LogMessagesHistorySectionComponent = (props: Props) => {
    const urlPathContext = useURLPathContext();
    const logMessagesDataContext = useLogMessagesDataContext();

    const logTimeRangeFromAllCanisters = useCustomCompareMemo(() => {
        return getLogTimeRangeFromAllCanisters(logMessagesDataContext.infoData)
    }, [logMessagesDataContext.infoData], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps));

    const configurationContext = useConfigurationContext();
    const canisterIds: Array<CanisterId> = configurationContext.configuration.canisters.map(v => v.canisterId)

    const [chunkSize, setChunkSize] = useState<number>(CHUNK_SIZE_FROM_EACH_CANISTER)

    const [fetchSequence, setFetchSequence] = useState<number>(0)

    const [lastAnalyzedMessageTimeNanos, setLastAnalyzedMessageTimeNanos] = useState<Nanos | undefined>(undefined)
    const [noMoreLogMessages, setNoMoreLogMessages] = useState<boolean>(false)

    const [calendarTimeMillis, setCalendarTimeMillis] = useState<number | undefined>(undefined)
    const [lineFilterString, setLineFilterString] = useState<string>("")
    const [lineFormatString, setLineFormatString] = useState<string>(DEFAULT_LINE_FORMAT_STRING)
    const [dateFormatString, setDateFormatString] = useState<string>(DEFAULT_DATE_FORMAT_STRING)

    const [canisterFilter, setCanisterFilter] = useState<Array<string>>([])

    const [status, updateStatus] = useReducer<Reducer<CGStatus, Partial<CGStatus>>>(
        (state, newState) => ({...state, ...newState}),
        {inProgress: false, loaded: false}
    )

    const [listItems, setListItems] = useState<Array<GetLogMessagesFnResultListItem>>([])

    const [errorsByCanister, updateErrorsByCanister] = useReducer<Reducer<CGErrorByKey, { [key: CanisterId]: Partial<CGError> }>>(
        (state, newState) => {
            const result = {...state}
            _.each(newState, (value, key) => {
                result[key] = {
                    ...result[key],
                    ...value
                }
            })
            return result
        },
        {}
    )

    const buildCanisterLogMessagesParams = useCustomCompareCallback((): FetchLogMessagesFnParams => {
        const arrayOfCanisterIds = _.isEmpty(canisterFilter) ? canisterIds : canisterFilter
        return {
            getLogMessagesParameters: {
                canisters: arrayOfCanisterIds.map<GetLogMessagesCanisterContextMessages>((canisterId) => {
                    let _fromTimeNanos: [] | [Nanos] = []
                    let _filter: [] | [GetLogMessagesFilter] = []

                    if (!_.isEmpty(lineFilterString)) {
                        _filter = [{
                            messageContains: [lineFilterString],
                            messageRegex: [],
                            analyzeCount: chunkSize
                        }]
                    }
                    if (!_.isNil(lastAnalyzedMessageTimeNanos)) {
                        _fromTimeNanos = [lastAnalyzedMessageTimeNanos]
                    }
                    const parameters: GetLogMessagesParameters = {
                        count: chunkSize,
                        filter: _filter,
                        fromTimeNanos: _fromTimeNanos
                    };
                    return {
                        canisterId: canisterId,
                        requestType: "messages",
                        parameters: parameters,
                    }
                }),
                sortItemsBy: (item: GetLogMessagesFnResultListItem) => item.logMessagesData.timeNanos
            },
            replaceListItems: false
        }
    }, [lineFilterString, canisterIds, canisterFilter, lastAnalyzedMessageTimeNanos, chunkSize], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps))

    const fetchLogMessages: FetchLogMessagesFn = useCustomCompareCallback(async (parameters: FetchLogMessagesFnParams) => {
        updateStatus({inProgress: true})
        try {
            await logMessagesDataContext.getInfos(parameters.getLogMessagesParameters.canisters.map(v => v.canisterId))
            const result = await logMessagesDataContext.getLogMessages(parameters.getLogMessagesParameters)
            const newListItems = parameters.replaceListItems ? result.listItems : [
                ...listItems,
                ...result.listItems
            ]
            unstable_batchedUpdates(() => {
                updateStatus({inProgress: false, loaded: true})
                updateErrorsByCanister(result.errorsByCanister)
                setFetchSequence(fetchSequence + 1)
                setListItems(newListItems)
                setLastAnalyzedMessageTimeNanos(result.lastAnalyzedMessageTimeNanos)
                setNoMoreLogMessages(_.isNil(result.lastAnalyzedMessageTimeNanos))
            })
        } catch (e) {
            console.error(`fetchLogMessages failed: caught error`, e);
            unstable_batchedUpdates(() => {
                setListItems([])
                updateStatus({inProgress: false, loaded: true})
                updateErrorsByCanister(_.mapValues(_.mapKeys(parameters.getLogMessagesParameters.canisters, v => v.canisterId), () => ({isError: true, error: e})))
            })
        }

    }, [props.identity, props.host, listItems, fetchSequence, chunkSize], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps))

    const onClickShow = useCallback(() => {
        const params = buildCanisterLogMessagesParams()
        _.each(params.getLogMessagesParameters.canisters, param => {
            param.parameters.fromTimeNanos = [BigInt(calendarTimeMillis * 1_000_000)]
        })
        params.replaceListItems = true
        fetchLogMessages(params)
    }, [buildCanisterLogMessagesParams, fetchLogMessages, calendarTimeMillis])

    const onClickLoadMore = useCallback(() => {
        const params = buildCanisterLogMessagesParams()
        fetchLogMessages(params)
    }, [buildCanisterLogMessagesParams, fetchLogMessages])

    const lineFormatFn: LineFormatFn = useCallback<LineFormatFn>((item) => {
        return formatLine(item, lineFormatString, dateFormatString)
    }, [lineFormatString, dateFormatString])

    const onChangeLineFilter = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setLineFilterString(event.target.value)
    }, [])

    const onChangeDatePicker = useCallback((value) => {
        const millis = value?.valueOf();
        setCalendarTimeMillis(millis)
    }, [])

    const disabledDateDatePicker = useCustomCompareCallback((date: MomentType): boolean => {
        return DateTimeUtils.isDisabledDateForDatePicker(date?.valueOf(), {
            minMillis: logTimeRangeFromAllCanisters?.fromMillis,
            maxMillis: logTimeRangeFromAllCanisters?.toMillis
        })
    }, [logTimeRangeFromAllCanisters], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps))

    const disabledTimeDatePicker = useCustomCompareCallback((date: MomentType): DisabledTimes => {
        return DateTimeUtils.getDisabledTimesForDatePicker(date?.valueOf(), {
            minMillis: logTimeRangeFromAllCanisters?.fromMillis,
            maxMillis: logTimeRangeFromAllCanisters?.toMillis
        })
    }, [logTimeRangeFromAllCanisters], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps))

    const infoDataNotEmpty = _.some(logMessagesDataContext.infoData, value => !_.isNil(value));

    if (!infoDataNotEmpty) {
        return <Result status="warning" title={`No data.`} subTitle={<>Please double check you’ve integrated latest <a href={urlPathContext.githubMotokoLibraryURL} target={"_blank"}>Motoko</a> or <a href={urlPathContext.githubRustLibraryURL} target={"_blank"}>Rust</a> library into your canisters</>}/>
    }

    const datePickerValue = _.isNumber(calendarTimeMillis) ? Moment(calendarTimeMillis) : undefined
    const showButtonDisabled = status.inProgress || _.isNil(calendarTimeMillis)

    return <div className={"logMessagesSection"}>
        <PageContent.Card>
            <Form layout={"vertical"} className={"canistergeekForm"}>
                <Row gutter={12}>
                    <Col>
                        <Form.Item label={"From"}>
                            <DatePicker showTime onChange={onChangeDatePicker} value={datePickerValue} format={DEFAULT_DATE_FORMAT_STRING} allowClear placeholder={"Start from time..."} disabledDate={disabledDateDatePicker} disabledTime={disabledTimeDatePicker}/>
                        </Form.Item>
                    </Col>
                </Row>
                <PageContent.CardSection></PageContent.CardSection>
                <Row gutter={12}>
                    <Col span={4}>
                        <Form.Item label={"Message Filter (slow, case sensitive)"}>
                            <Input onChange={onChangeLineFilter} value={lineFilterString} allowClear maxLength={LINE_FILTER_MAX_LENGTH}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <LogMessagesCanistersMultiSelect
                            canisterFilter={canisterFilter}
                            setCanisterFilter={setCanisterFilter}
                        />
                    </Col>
                </Row>
                <Row className="drawButtonRow">
                    <Col span={24}>
                        <ShowButton onClick={onClickShow} disabled={showButtonDisabled} loading={status.inProgress}/>
                    </Col>
                </Row>
            </Form>
        </PageContent.Card>
        {status.loaded ? <>
            <PageContent.CardSpacer/>
            <PageContent.Card>
                <LogMessagesList inProgress={status.inProgress} listItems={listItems} lineFormat={lineFormatFn} sequence={fetchSequence} loadMoreDisabled={noMoreLogMessages} onClickLoadMore={onClickLoadMore}/>
            </PageContent.Card>
        </> : null}
    </div>
}

const getLogTimeRangeFromAllCanisters = (infoData: InfoDataByCanister): { fromMillis: number, toMillis: number } | undefined => {
    if (_.isEmpty(infoData)) {
        return undefined
    }

    const fromMillis = Math.floor(Number(_.min(_.compact(_.map(infoData, v => v?.firstTimeNanos)))) / 1_000_000)
    const toMillis = Math.floor(Number(_.max(_.compact(_.map(infoData, v => v?.lastTimeNanos)))) / 1_000_000)

    return {
        fromMillis: fromMillis,
        toMillis: toMillis,
    }
}