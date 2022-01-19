import * as React from "react";
declare type Props = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: React.ReactElement;
    description: React.ReactElement;
};
export declare const PageContentAlert: (props: Props) => JSX.Element;
export {};
