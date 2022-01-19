"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationPage = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const antd_1 = require("antd");
const ConfigurationTextarea_1 = require("./ConfigurationTextarea");
const ConfigurationJSONInterfaceComponent_1 = require("./ConfigurationJSONInterfaceComponent");
const ConfigurationJSONExampleComponent_1 = require("./ConfigurationJSONExampleComponent");
const react_router_dom_1 = require("react-router-dom");
const URLPathProvider_1 = require("./URLPathProvider");
const ConfigurationLocalStorageProvider_1 = require("../dataProvider/ConfigurationLocalStorageProvider");
const ConfigurationValidator_1 = require("../dataProvider/ConfigurationValidator");
const PageContent_1 = require("./PageContent");
const Constants_1 = require("../dataProvider/Constants");
const ConfigurationPage = () => {
    const urlPathContext = (0, URLPathProvider_1.useURLPathContext)();
    const configurationStorageContext = (0, ConfigurationLocalStorageProvider_1.useConfigurationStorageContext)();
    const history = (0, react_router_dom_1.useHistory)();
    const [textareaValue, setTextareaValue] = (0, react_1.useState)(() => {
        if (configurationStorageContext.configuration) {
            return JSON.stringify(configurationStorageContext.configuration, null, 4);
        }
        return "";
    });
    const [textareaHasValidJSON, setTextareaHasValidJSON] = (0, react_1.useState)(() => {
        return ConfigurationValidator_1.ConfigurationValidator.validateConfiguration(textareaValue);
    });
    const onChange = (0, react_1.useCallback)((value) => {
        const valid = ConfigurationValidator_1.ConfigurationValidator.validateConfiguration(value);
        setTextareaHasValidJSON(valid);
        setTextareaValue(value);
    }, []);
    const onClickSave = (0, react_1.useCallback)(() => {
        configurationStorageContext.storeConfiguration(JSON.parse(textareaValue));
        history.push(urlPathContext.pathToSection("summary"));
    }, [textareaValue]);
    const onClickExample = (0, react_1.useCallback)(() => {
        onChange(ConfigurationJSONExampleComponent_1.exampleConfigurationJSON);
    }, []);
    return React.createElement(React.Fragment, null,
        React.createElement(antd_1.PageHeader, { title: `${Constants_1.PRODUCT_NAME}: Configuration` }),
        React.createElement(PageContent_1.PageContent, null,
            React.createElement(PageContent_1.PageContent.CardSpacer, null),
            React.createElement(PageContent_1.PageContent.Card, null,
                React.createElement(PageContent_1.PageContent.CardSection, null, "JSON Interface"),
                React.createElement(antd_1.Space, { direction: "vertical", style: { width: "100%" } },
                    React.createElement(antd_1.Alert, { type: "warning", message: React.createElement(React.Fragment, null,
                            "Configuration is stored in browser's ",
                            React.createElement("b", null, "localStorage only"),
                            ".") }),
                    React.createElement(ConfigurationTextarea_1.ConfigurationTextarea, { height: 350, onChange: onChange, value: textareaValue }),
                    React.createElement(antd_1.Row, null,
                        React.createElement(antd_1.Col, null,
                            React.createElement(antd_1.Button, { type: "primary", onClick: onClickSave, disabled: !textareaHasValidJSON }, "Save")),
                        React.createElement(antd_1.Col, { flex: "auto" },
                            React.createElement(antd_1.Row, { justify: "end" },
                                React.createElement(antd_1.Col, null,
                                    React.createElement(antd_1.Button, { onClick: onClickExample }, "Example"))))))),
            React.createElement(PageContent_1.PageContent.CardSpacer, null),
            React.createElement(PageContent_1.PageContent.Card, null,
                React.createElement(antd_1.Collapse, null,
                    React.createElement(antd_1.Collapse.Panel, { key: "1", header: "JSON Interface" },
                        React.createElement(ConfigurationJSONInterfaceComponent_1.ConfigurationJSONInterfaceComponent, null)))),
            React.createElement(PageContent_1.PageContent.CardSpacer, null),
            React.createElement(PageContent_1.PageContent.Card, null,
                React.createElement(antd_1.Collapse, null,
                    React.createElement(antd_1.Collapse.Panel, { key: "1", header: "JSON Example" },
                        React.createElement(ConfigurationJSONExampleComponent_1.ConfigurationJSONExampleComponent, null))))));
};
exports.ConfigurationPage = ConfigurationPage;
//# sourceMappingURL=ConfigurationPage.js.map