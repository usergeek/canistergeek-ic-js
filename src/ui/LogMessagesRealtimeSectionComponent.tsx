import {Col, Form, Input, Result, Row} from "antd";
import * as React from "react";
import {ChangeEvent, Reducer, useCallback, useReducer, useState} from "react";
import {Identity} from "@dfinity/agent";
import {GetLatestLogMessagesParameters, GetLogMessagesFilter, Nanos} from "../api/canistergeek.did";
import _ from "lodash";
import {CanisterId, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {useCustomCompareCallback} from "use-custom-compare";
import {unstable_batchedUpdates} from "react-dom";
import {ShowButton} from "./ShowButton";
import {PageContent} from "./PageContent";
import {LineFormatFn, LogMessagesList} from "./LogMessagesList";
import Moment from "moment";
import {stringInject} from "./CanistergeekLogMessagesPage";
import {GetLogMessagesCanisterContextLatestMessages, GetLogMessagesFnParameters, GetLogMessagesFnResultListItem, useLogMessagesDataContext} from "../dataProvider/LogMessagesDataProvider";
import {LogMessagesCanistersMultiSelect} from "./LogMessagesCanistersMultiSelect";
import {useURLPathContext} from "./URLPathProvider";
import {CGError, CGErrorByKey, CGStatus} from "../dataProvider/Commons";

import "./form.less"
import "./logMessagesRealtimeSectionComponent.less"

export const CHUNK_SIZE_FROM_EACH_CANISTER = 500
const LINE_FORMAT_STRING_TOKEN_DATE = "{0}"
const LINE_FORMAT_STRING_TOKEN_CANISTER_ID = "{1}"
const LINE_FORMAT_STRING_TOKEN_MESSAGE = "{2}"
export const DEFAULT_LINE_FORMAT_STRING = `${LINE_FORMAT_STRING_TOKEN_DATE} :: ${LINE_FORMAT_STRING_TOKEN_CANISTER_ID} :: ${LINE_FORMAT_STRING_TOKEN_MESSAGE}`
export const DEFAULT_DATE_FORMAT_STRING = "MM/DD hh:mm:ss.SSS A"

export const LINE_FILTER_MAX_LENGTH = 20

type FetchLogMessagesFnParams = {
    getLogMessagesParameters: GetLogMessagesFnParameters<GetLogMessagesCanisterContextLatestMessages>
    replaceListItems: boolean
}
type FetchLogMessagesFn = (parameters: FetchLogMessagesFnParams) => void

type Props = {
    identity?: Identity
    host?: string
}

export const LogMessagesRealtimeSectionComponent = (props: Props) => {
    const urlPathContext = useURLPathContext();
    const logMessagesDataContext = useLogMessagesDataContext();
    const configurationContext = useConfigurationContext();
    const canisterIds: Array<CanisterId> = configurationContext.configuration.canisters.map(v => v.canisterId)

    const [chunkSize, setChunkSize] = useState<number>(CHUNK_SIZE_FROM_EACH_CANISTER)

    const [fetchSequence, setFetchSequence] = useState<number>(0)

    const [lastAnalyzedMessageTimeNanos, setLastAnalyzedMessageTimeNanos] = useState<Nanos | undefined>(undefined)
    const [noMoreLogMessages, setNoMoreLogMessages] = useState<boolean>(false)

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

    const buildCanisterLatestLogMessagesParams = useCustomCompareCallback((): FetchLogMessagesFnParams => {
        const arrayOfCanisterIds = _.isEmpty(canisterFilter) ? canisterIds : canisterFilter
        return {
            getLogMessagesParameters: {
                canisters: arrayOfCanisterIds.map<GetLogMessagesCanisterContextLatestMessages>((canisterId) => {
                    let _upToTimeNanos: [] | [Nanos] = []
                    let _filter: [] | [GetLogMessagesFilter] = []
                    if (!_.isEmpty(lineFilterString)) {
                        _filter = [{
                            messageContains: [lineFilterString],
                            messageRegex: [],
                            analyzeCount: chunkSize
                        }]
                    }
                    if (!_.isNil(lastAnalyzedMessageTimeNanos)) {
                        _upToTimeNanos = [lastAnalyzedMessageTimeNanos]
                    }
                    const parameters: GetLatestLogMessagesParameters = {
                        count: chunkSize,
                        filter: _filter,
                        upToTimeNanos: _upToTimeNanos
                    };
                    return {
                        canisterId: canisterId,
                        requestType: "lastMessages",
                        parameters: parameters,
                    }
                }),
                sortItemsBy: (item: GetLogMessagesFnResultListItem) => -item.logMessagesData.timeNanos
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
        const params = buildCanisterLatestLogMessagesParams()
        _.each(params.getLogMessagesParameters.canisters, param => {
            param.parameters.upToTimeNanos = []
        })
        params.replaceListItems = true
        fetchLogMessages(params)
    }, [buildCanisterLatestLogMessagesParams, fetchLogMessages])

    const onClickLoadMore = useCallback(() => {
        const params = buildCanisterLatestLogMessagesParams()
        fetchLogMessages(params)
    }, [buildCanisterLatestLogMessagesParams, fetchLogMessages])

    const lineFormatFn: LineFormatFn = useCallback<LineFormatFn>((item) => {
        return formatLine(item, lineFormatString, dateFormatString)
    }, [lineFormatString, dateFormatString])

    const onChangeLineFilter = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setLineFilterString(event.target.value)
    }, [])

    const onChangeLineFormat = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setLineFormatString(event.target.value)
    }, [])

    const onChangeDateFormat = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setDateFormatString(event.target.value)
    }, [])

    const infoDataNotEmpty = _.some(logMessagesDataContext.infoData, value => !_.isNil(value));

    if (!infoDataNotEmpty) {
        return <Result status="warning" title={`No data.`} subTitle={<>Please double check you’ve integrated latest <a href={urlPathContext.githubMotokoLibraryURL} target={"_blank"}>Motoko</a> or <a href={urlPathContext.githubRustLibraryURL} target={"_blank"}>Rust</a> library into your canisters</>}/>
    }

    const showButtonDisabled = status.inProgress

    return <div className={"logMessagesSection"}>
        <PageContent.Card>
            <Form layout={"vertical"} className={"canistergeekForm"}>
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

export const formatLine = (item: GetLogMessagesFnResultListItem, lineFormatString: string, dateFormatString: string): string => {
    let _lineFormatString = lineFormatString
    if (_.isEmpty(_lineFormatString)) {
        _lineFormatString = DEFAULT_LINE_FORMAT_STRING
    }

    let _dateFormatString = dateFormatString
    if (_.isEmpty(_dateFormatString)) {
        _dateFormatString = DEFAULT_DATE_FORMAT_STRING
    }

    const dateTime: string = Moment(Number(item.logMessagesData.timeNanos) / 1_000_000).format(_dateFormatString)
    const canisterId = item.canisterId;
    const message = item.logMessagesData.message;

    return stringInject(_lineFormatString, [dateTime, canisterId, message])
}