/**
 * We want to check if prop is a property key of obj
 * @param obj - object
 * @param prop - property
 * @link https://fettblog.eu/typescript-hasownproperty/
 */
export declare function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown>;
