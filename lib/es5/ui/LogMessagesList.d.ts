/// <reference types="react" />
import { GetLogMessagesFnResultListItem } from "../dataProvider/LogMessagesDataProvider";
export declare type LineFormatFn = (item: GetLogMessagesFnResultListItem) => string;
declare type Props = {
    inProgress: boolean;
    sequence: number;
    listItems: Array<GetLogMessagesFnResultListItem>;
    lineFormat: LineFormatFn;
    onClickLoadMore: () => void;
    loadMoreDisabled: boolean;
};
export declare const LogMessagesList: (props: Props) => JSX.Element;
export {};
