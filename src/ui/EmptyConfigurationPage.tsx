import * as React from "react";
import {useCallback} from "react";
import {Button, Col, PageHeader, Result, Row} from "antd";
import {useHistory} from "react-router-dom";
import {PageContent} from "./PageContent";
import {PRODUCT_NAME} from "../dataProvider/Constants";
import {useURLPathContext} from "./URLPathProvider";

export const EmptyConfigurationPage = () => {
    const urlPathContext = useURLPathContext();
    const history = useHistory()
    const onClick = useCallback(() => {
        history.push(urlPathContext.configPath)
    }, [urlPathContext.configPath])
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
                                    <li style={{paddingLeft: "10px"}}>Integrate <a href={urlPathContext.githubMotokoLibraryURL} target={"_blank"}>Motoko</a> or <a href={urlPathContext.githubRustLibraryURL} target={"_blank"}>Rust</a> library into your canisters</li>
                                    <li style={{paddingLeft: "10px"}}><b>HIGHLY RECOMMENDED</b>:<br/>Limit access to your data only to specific principals.<br/>More information <a href={urlPathContext.githubMotokoLibraryLimitAccessURL} target={"_blank"}>here</a> or <a href={urlPathContext.githubRustLibraryLimitAccessURL} target={"_blank"}>here</a></li>
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