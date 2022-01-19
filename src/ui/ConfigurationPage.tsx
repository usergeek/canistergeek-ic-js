import * as React from "react";
import {useCallback, useState} from "react";
import {Alert, Button, Col, Collapse, PageHeader, Row, Space} from "antd";
import {ConfigurationTextarea} from "./ConfigurationTextarea";
import {ConfigurationJSONInterfaceComponent} from "./ConfigurationJSONInterfaceComponent";
import {ConfigurationJSONExampleComponent, exampleConfigurationJSON} from "./ConfigurationJSONExampleComponent";
import {useHistory} from "react-router-dom";
import {useURLPathContext} from "./URLPathProvider";
import {Configuration} from "../dataProvider/ConfigurationProvider";
import {useConfigurationStorageContext} from "../dataProvider/ConfigurationLocalStorageProvider";
import {ConfigurationValidator} from "../dataProvider/ConfigurationValidator";
import {PageContent} from "./PageContent";
import {PRODUCT_NAME} from "../dataProvider/Constants";

export const ConfigurationPage = () => {
    const urlPathContext = useURLPathContext();
    const configurationStorageContext = useConfigurationStorageContext();

    const history = useHistory()
    const [textareaValue, setTextareaValue] = useState<string>(() => {
        if (configurationStorageContext.configuration) {
            return JSON.stringify(configurationStorageContext.configuration, null, 4)
        }
        return ""
    })
    const [textareaHasValidJSON, setTextareaHasValidJSON] = useState<boolean>(() => {
        return ConfigurationValidator.validateConfiguration(textareaValue)
    })

    const onChange = useCallback((value: string) => {
        const valid = ConfigurationValidator.validateConfiguration(value)
        setTextareaHasValidJSON(valid)
        setTextareaValue(value)
    }, [])

    const onClickSave = useCallback(() => {
        configurationStorageContext.storeConfiguration(JSON.parse(textareaValue) as Configuration)
        history.push(urlPathContext.pathToSection("summary"))
    }, [textareaValue])

    const onClickExample = useCallback(() => {
        onChange(exampleConfigurationJSON)
    }, [])

    return <>
        <PageHeader title={`${PRODUCT_NAME}: Configuration`}/>
        <PageContent>
            <PageContent.CardSpacer/>
            <PageContent.Card>
                <PageContent.CardSection>JSON Interface</PageContent.CardSection>
                <Space direction={"vertical"} style={{width: "100%"}}>
                    <Alert type={"warning"} message={<>Configuration is stored in browser's <b>localStorage only</b>.</>}/>
                    <ConfigurationTextarea height={350} onChange={onChange} value={textareaValue}/>
                    <Row>
                        <Col>
                            <Button type={"primary"} onClick={onClickSave} disabled={!textareaHasValidJSON}>Save</Button>
                        </Col>
                        <Col flex={"auto"}>
                            <Row justify={"end"}><Col><Button onClick={onClickExample}>Example</Button></Col></Row>
                        </Col>
                    </Row>
                </Space>
            </PageContent.Card>
            <PageContent.CardSpacer/>
            <PageContent.Card>
                <Collapse>
                    <Collapse.Panel key={"1"} header={"JSON Interface"}>
                        <ConfigurationJSONInterfaceComponent/>
                    </Collapse.Panel>
                </Collapse>
            </PageContent.Card>
            <PageContent.CardSpacer/>
            <PageContent.Card>
                <Collapse>
                    <Collapse.Panel key={"1"} header={"JSON Example"}>
                        <ConfigurationJSONExampleComponent/>
                    </Collapse.Panel>
                </Collapse>
            </PageContent.Card>
        </PageContent>
    </>
}