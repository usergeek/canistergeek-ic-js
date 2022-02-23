import * as React from "react";
import {useCallback, useState} from "react";
import {Alert, Button, Col, Collapse, PageHeader, Popconfirm, Row, Space} from "antd";
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
        const {valid} = ConfigurationValidator.validateConfiguration(textareaValue)
        return valid
    })

    const [textareaValidationError, setTextareaValidationError] = useState<Error | undefined>(() => {
        const {error} = ConfigurationValidator.validateConfiguration(textareaValue)
        return error
    })

    const onChange = useCallback((value: string) => {
        const {valid, error} = ConfigurationValidator.validateConfiguration(value)
        setTextareaHasValidJSON(valid)
        setTextareaValidationError(error)
        setTextareaValue(value)
    }, [])

    const onClickSave = useCallback(() => {
        configurationStorageContext.storeConfiguration(JSON.parse(textareaValue) as Configuration)
        history.push(urlPathContext.pathToMetricsSection("summary"))
    }, [textareaValue])

    const onClickExample = useCallback(() => {
        onChange(exampleConfigurationJSON)
    }, [])

    const errorMessage: string = textareaValidationError ? textareaValidationError.message : null

    const exampleButton = textareaValue.length == 0 ?
        <Button onClick={onClickExample}>Example</Button> :
        <Popconfirm
            title="Are you sure to overwrite configuration with example?"
            onConfirm={onClickExample}
            okText="Yes"
            okButtonProps={{type: "default"}}
            cancelText="No"
            cancelButtonProps={{type: "primary"}}
            placement="topRight">
            <Button>Example</Button>
        </Popconfirm>
    return <>
        <PageHeader title={`${PRODUCT_NAME}: Settings`}/>
        <PageContent>
            <PageContent.CardSpacer/>
            <PageContent.Card>
                <PageContent.CardSection>JSON Interface</PageContent.CardSection>
                <Space direction={"vertical"} style={{width: "100%"}}>
                    <Alert type={"warning"} message={<>Configuration is stored in browser's <b>localStorage only</b>.</>}/>
                    <ConfigurationTextarea height={350} onChange={onChange} value={textareaValue}/>
                    <Row align={"middle"} gutter={16}>
                        <Col>
                            <Button type={"primary"} onClick={onClickSave} disabled={!textareaHasValidJSON}>Save</Button>
                        </Col>
                        <Col style={{color: "red"}}>{errorMessage}</Col>
                        <Col flex={"auto"}>
                            <Row justify={"end"}><Col>{exampleButton}</Col></Row>
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