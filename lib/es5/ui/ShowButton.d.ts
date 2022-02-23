/// <reference types="react" />
export declare type ShowOnClick = () => void;
export declare type ShowButtonProps = {
    loading: boolean;
    disabled: boolean;
    onClick: ShowOnClick;
};
export declare const ShowButton: ({ disabled, loading, onClick }: ShowButtonProps) => JSX.Element;
