"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryKeyValueStore = void 0;
const KeyValueStore_1 = require("./KeyValueStore");
class InMemoryKeyValueStore {
    constructor() {
        this.items = {};
    }
    isFake() {
        return true;
    }
    set(key, data) {
        this.items[key] = (0, KeyValueStore_1.stringifyValue)(data);
    }
    get(key) {
        const storageValue = this.items[key];
        if (storageValue) {
            return (0, KeyValueStore_1.parseValue)(storageValue);
        }
        return undefined;
    }
    remove(key) {
        delete this.items[key];
    }
    clearAll() {
        this.items = {};
    }
    isEmpty() {
        for (const key in this.items) {
            if (this.items.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}
exports.InMemoryKeyValueStore = InMemoryKeyValueStore;
//# sourceMappingURL=InMemoryKeyValueStore.js.map