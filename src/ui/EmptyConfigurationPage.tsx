import * as React from "react";
import {useCallback} from "react";
import {Button, Col, PageHeader, Result, Row} from "antd";
import {useHistory} from "react-router-dom";
import {PageContent} from "./PageContent";
import {PRODUCT_NAME} from "../dataProvider/Constants";

type Props = {
    configURL: string
    githubMotokoLibraryURL: string
    githubMotokoLibraryLimitAccessURL: string
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
                    title={`Configuration is empty`}
                    subTitle={<Row justify={"center"}>
                        <Col>
                            <div style={{textAlign: "left", marginTop: "25px"}}>
                                <ol style={{padding: 0, listStylePosition: "outside"}}>
                                    <li style={{paddingLeft: "10px"}}>Integrate <a href={props.githubMotokoLibraryURL} target={"_blank"}>Motoko Library</a> into your canisters</li>
                                    <li style={{paddingLeft: "10px"}}><b>HIGHLY RECOMMENDED</b>:<br/>Limit access to your data only to specific principals.<br/>More information <a href={props.githubMotokoLibraryLimitAccessURL} target={"_blank"}>here</a></li>
                                    <li style={{paddingLeft: "10px"}}>Set up configuration: provide list of canister principals</li>
                                </ol>
                            </div>
                        </Col>
                    </Row>}
                    extra={<Button type="primary" key="console" onClick={onClick}>Set Up</Button>}
                />
            </PageContent.Card>
        </PageContent>
    </>
}