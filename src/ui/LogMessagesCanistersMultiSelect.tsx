import * as React from "react";
import {useCallback} from "react";
import {Form, Select} from "antd";
import {SelectTagRenderer} from "./SelectTagRenderer";
import {DefaultOptionType} from "rc-select/lib/Select";
import _ from "lodash";
import {useLogMessagesDataContext} from "../dataProvider/LogMessagesDataProvider";
import {CanisterId, useConfigurationContext} from "../dataProvider/ConfigurationProvider";
import {useCustomCompareMemo} from "use-custom-compare";

type Props = {
    canisterFilter: Array<string>
    setCanisterFilter: (value: Array<string>) => void
}

export const LogMessagesCanistersMultiSelect = (props: Props) => {
    const configurationContext = useConfigurationContext();
    const logMessagesDataContext = useLogMessagesDataContext();

    const canisterIds: Array<CanisterId> = configurationContext.configuration.canisters.map(v => v.canisterId)
    const atLeastOneCanisterInfoInProgress = _.some(logMessagesDataContext.infoStatus, value => value.inProgress);

    const onChangeCanisters = useCallback((value: Array<string>) => {
        props.setCanisterFilter(value)
    }, [props.setCanisterFilter])

    const canisterSelectOptions: Array<DefaultOptionType> = useCustomCompareMemo(() => {
        return _.compact(configurationContext.configuration.canisters.map(v => {
            if (_.isNil(logMessagesDataContext.infoData[v.canisterId])) {
                return undefined
            }
            return {
                label: `${v.name} | ${v.canisterId}`,
                value: v.canisterId,
            }
        }))
    }, [logMessagesDataContext.infoData], (prevDeps, nextDeps) => _.isEqual(prevDeps, nextDeps))

    const onFocusCanisters = useCallback(() => {
        if (_.isEmpty(canisterSelectOptions)) {
            logMessagesDataContext.getInfos(canisterIds)
        }
    }, [canisterSelectOptions, canisterIds, logMessagesDataContext.getInfos])

    return <Form.Item label={"Canisters"}>
        <Select<Array<string>>
            bordered={true}
            mode="multiple"
            value={props.canisterFilter}
            optionLabelProp="label"
            optionFilterProp="label"
            placeholder={"Names or principals..."}
            notFoundContent={<>No canisters with log messages...</>}
            showSearch={true}
            onChange={onChangeCanisters}
            onFocus={onFocusCanisters}
            options={canisterSelectOptions}
            tokenSeparators={[',', ';']}
            tagRender={SelectTagRenderer}
            loading={atLeastOneCanisterInfoInProgress}
            maxTagCount={2}
        />
    </Form.Item>
}