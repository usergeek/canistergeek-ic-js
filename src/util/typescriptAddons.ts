/**
 * We want to check if prop is a property key of obj
 * @param obj - object
 * @param prop - property
 * @link https://fettblog.eu/typescript-hasownproperty/
 */
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop)
}

/*
https://dev.to/safareli/pick-omit-and-union-types-in-typescript-4nd9
*/
type Keys<T> = keyof T;
type DistributiveKeys<T> = T extends unknown ? Keys<T> : never;
type Pick_<T, K> = Pick<T, Extract<keyof T, K>>;
type Omit_<T, K> = Omit<T, Extract<keyof T, K>>;

export type KeysOfUnion<T> = T extends T ? keyof T: never;

export type DistributivePick<T, K extends DistributiveKeys<T>> =
    T extends unknown
        ? keyof Pick_<T, K> extends never
            ? never
            : { [P in keyof Pick_<T, K>]: Pick_<T, K>[P] }
        : never;

export type DistributiveOmit<T, K extends DistributiveKeys<T>> =
    T extends unknown
        ? keyof Omit_<T, K> extends never
            ? never
            : { [P in keyof Omit_<T, K>]: Omit_<T, K>[P] }
        : never;