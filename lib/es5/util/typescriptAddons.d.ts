/**
 * We want to check if prop is a property key of obj
 * @param obj - object
 * @param prop - property
 * @link https://fettblog.eu/typescript-hasownproperty/
 */
export declare function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown>;
declare type Keys<T> = keyof T;
declare type DistributiveKeys<T> = T extends unknown ? Keys<T> : never;
declare type Pick_<T, K> = Pick<T, Extract<keyof T, K>>;
declare type Omit_<T, K> = Omit<T, Extract<keyof T, K>>;
export declare type DistributivePick<T, K extends DistributiveKeys<T>> = T extends unknown ? keyof Pick_<T, K> extends never ? never : {
    [P in keyof Pick_<T, K>]: Pick_<T, K>[P];
} : never;
export declare type DistributiveOmit<T, K extends DistributiveKeys<T>> = T extends unknown ? keyof Omit_<T, K> extends never ? never : {
    [P in keyof Omit_<T, K>]: Omit_<T, K>[P];
} : never;
export {};
