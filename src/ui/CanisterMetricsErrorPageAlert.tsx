import * as React from "react";
import {CanisterError} from "../dataProvider/DataProvider";
import _ from "lodash";
import {PageContentAlert} from "./PageContentAlert";
import {QueryCallRejectedError} from "@dfinity/agent";
import {Typography} from "antd";
import {EllipsisConfig} from "antd/lib/typography/Base";

const paragraphEllipsisConfig: EllipsisConfig = {
    rows: 1,
    expandable: true,
    symbol: 'more'
};

type Props = {
    error: CanisterError
}

export const CanisterMetricsErrorPageAlert = (props: Props) => {

    const hasErrors = _.some(props.error, value => {
        return value.isError
    });

    if (hasErrors) {
        return <PageContentAlert type={"error"} message={<>Oops, something went wrong</>} description={<>
            Please try again.
            <ol>
                {_.map(props.error, (v, k) => {
                    if (v.isError) {
                        if (v.error instanceof QueryCallRejectedError) {
                            const ee: QueryCallRejectedError = v.error as QueryCallRejectedError
                            const canisterId = ee.canisterId.toText()
                            return <li key={canisterId}>
                                {canisterId}<br/>
                                <Typography.Paragraph ellipsis={paragraphEllipsisConfig}>
                                    {ee.message}
                                </Typography.Paragraph>
                            </li>
                        } else if (v.error instanceof Error) {
                            const ee: Error = v.error as Error
                            const canisterId = k
                            return <li key={canisterId}>
                                {canisterId}<br/>
                                <Typography.Paragraph ellipsis={paragraphEllipsisConfig}>
                                    {ee.message}
                                </Typography.Paragraph>
                            </li>
                        } else {
                            const canisterId = k
                            return <li key={canisterId}>
                                {canisterId}<br/>
                                <Typography.Paragraph ellipsis={paragraphEllipsisConfig}>
                                    {JSON.stringify(v.error)}
                                </Typography.Paragraph>
                            </li>
                        }
                    }
                    return null
                })}
            </ol>
        </>}/>
    }
    return null
}