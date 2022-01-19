import * as React from "react";
import { PropsWithChildren } from "react";
export declare type Section = "summary" | string;
declare type PathToSectionFn = (section: Section) => string;
interface Context {
    configPath: string;
    basePathRoot: string;
    basePath: string;
    pathToSection: PathToSectionFn;
}
export declare const URLPathContext: React.Context<Context>;
export declare const useURLPathContext: () => Context;
declare type Props = {
    configPath: string;
    basePath: string;
};
export declare const URLPathProvider: (props: PropsWithChildren<Props>) => JSX.Element;
export {};
