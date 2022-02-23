/// <reference types="react" />
import { Identity } from "@dfinity/agent";
import { GetLogMessagesFnResultListItem } from "../dataProvider/LogMessagesDataProvider";
import "./form.less";
import "./logMessagesRealtimeSectionComponent.less";
export declare const CHUNK_SIZE_FROM_EACH_CANISTER = 500;
export declare const DEFAULT_LINE_FORMAT_STRING: string;
export declare const DEFAULT_DATE_FORMAT_STRING = "MM/DD hh:mm:ss.SSS A";
export declare const LINE_FILTER_MAX_LENGTH = 20;
declare type Props = {
    identity?: Identity;
    host?: string;
};
export declare const LogMessagesRealtimeSectionComponent: (props: Props) => JSX.Element;
export declare const formatLine: (item: GetLogMessagesFnResultListItem, lineFormatString: string, dateFormatString: string) => string;
export {};
