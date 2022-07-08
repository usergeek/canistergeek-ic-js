import * as React from "react";
import {Button, Col, Empty, Row} from "antd";
import _ from "lodash"
import {GetLogMessagesFnResultListItem} from "../dataProvider/LogMessagesDataProvider";

export type LineFormatFn = (item: GetLogMessagesFnResultListItem) => string

type Props = {
    inProgress: boolean
    sequence: number
    listItems: Array<GetLogMessagesFnResultListItem>
    lineFormat: LineFormatFn
    onClickLoadMore: () => void
    loadMoreDisabled: boolean
}

export const LogMessagesList = (props: Props) => {
    if (_.isEmpty(props.listItems)) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
    }
    return <>
        <Row gutter={[16, 16]} className={"logMessagesList logMessagesListPreWrap"}>
            <Col span={24}>
                {props.listItems.map((item, idx) => {
                    return <div key={`${props.sequence}_${idx}`}>
                        {props.lineFormat(item)}
                    </div>
                })}
            </Col>
            <Col>
                <Button onClick={props.onClickLoadMore} disabled={props.loadMoreDisabled || props.inProgress} loading={props.inProgress}>Load More</Button>
            </Col>
        </Row>
    </>
}