import * as React from "react";
import {Col, Progress, Row} from "antd";
import {MetricWrapper} from "../dataProvider/PrecalculatedDataProvider";
import {COLOR_GRAY_HEX, NO_OBJECT_VALUE_LABEL} from "../dataProvider/Constants";
import {DateUtils} from "../dataProvider/DateUtils";

export type ProgressProps<V> = {
    metricWrapper: MetricWrapper<V> | undefined
}

export function SummaryRealtimeLineProgressWithOutdatedInfo<V>(props: ProgressProps<V>) {
    const metricWrapper = props.metricWrapper;
    if (metricWrapper) {
        let outdatedContent: React.ReactNode = null
        if (metricWrapper.outdatedContext) {
            const differencesBetweenToMillis = DateUtils.Diff.getDifferenceBetweenToMillis(metricWrapper.outdatedContext.actualTimeMillis, new Date().getTime());
            const diffString = DateUtils.Diff.Formatter.formatDifferencesBetweenToMillis(differencesBetweenToMillis)
            outdatedContent = <>
                <div style={{fontSize: "0.75em", color: "darkgray"}}>({diffString} ago)</div>
            </>
        }
        if (metricWrapper.hasValue) {
            return <Row align={"middle"} gutter={8} style={{marginRight: "20px"}}>
                <Col flex={"auto"}><Progress type="line" percent={Math.max(7, metricWrapper.percentFromMax!)} strokeColor={metricWrapper.colorHex} showInfo={false}/></Col>
                <Col>{metricWrapper.label}</Col>
                {outdatedContent ? <Col>{outdatedContent}</Col> : null}
            </Row>
        }
    }
    return <span style={{color: COLOR_GRAY_HEX}}>{NO_OBJECT_VALUE_LABEL}</span>
}