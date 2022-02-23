"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseValue = exports.stringifyValue = void 0;
const stringifyValue = function (obj) {
    return JSON.stringify(obj);
};
exports.stringifyValue = stringifyValue;
const parseValue = function (str) {
    try {
        if (str) {
            return JSON.parse(str);
        }
    }
    catch (e) {
        // nop
    }
    return str;
};
exports.parseValue = parseValue;
//# sourceMappingURL=KeyValueStore.js.map