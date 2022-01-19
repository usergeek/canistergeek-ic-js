import * as React from "react";
import {useCallback} from "react";
import {Button, PageHeader, Result} from "antd";
import {useHistory} from "react-router-dom";
import {PageContent} from "./PageContent";
import {PRODUCT_NAME} from "../dataProvider/Constants";

type Props = {
    configURL: string
}

export const EmptyConfigurationPage = (props: Props) => {
    const history = useHistory()
    const onClick = useCallback(() => {
        history.push(props.configURL)
    }, [props.configURL])
    return <>
        <PageHeader title={`${PRODUCT_NAME}: Setup`}/>
        <PageContent>
            <PageContent.CardSpacer/>
            <PageContent.Card>
                <Result
                    status="warning"
                    title={`Configuration is empty.`}
                    extra={<Button type="primary" key="console" onClick={onClick}>Set Up</Button>}
                />
            </PageContent.Card>
        </PageContent>
    </>
}