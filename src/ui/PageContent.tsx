import * as React from "react";
import {PropsWithChildren} from "react";
import {Divider} from "antd";
import _ from "lodash"

export const PageContent = (props: PropsWithChildren<any>) => {
    let className = "pageContent"
    if (!_.isEmpty(props.className)) {
        className = className + " " + props.className
    }
    return <div className={className}>
        <Divider className="pageContentTopDivider"/>
        {props.children}
    </div>
}

const Card = (props: PropsWithChildren<any>) => {
    return <div className="pageContentCard">{props.children}</div>
}
PageContent.Card = Card

export const CardSpacer = (props: PropsWithChildren<any>) => {
    return <div className="pageContentCardSpacer">{props.children}</div>
}
PageContent.CardSpacer = CardSpacer

const CardSection = (props) => {
    return <div className="pageContentCardSection">{props.children}</div>
}
PageContent.CardSection = CardSection