"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageKeyValueStore = void 0;
const KeyValueStore_1 = require("./KeyValueStore");
const KeyValueStoreFacade_1 = require("./KeyValueStoreFacade");
const each = function (store, namespace, callback) {
    for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        const prefix = namespace;
        if (key && key.indexOf(prefix) === 0) {
            const rawKey = key.substring(prefix.length);
            callback(rawKey);
        }
    }
};
const allKeys = function (store, namespace) {
    const result = [];
    each(store, namespace, key => result.push(key));
    return result;
};
class LocalStorageKeyValueStore {
    constructor(namespace) {
        this.namespace = namespace;
        this.store = (0, KeyValueStoreFacade_1.grabLocalStorage)();
    }
    isFake() {
        return false;
    }
    set(key, data) {
        const k = this.namespace + key;
        const d = (0, KeyValueStore_1.stringifyValue)(data);
        this.store.setItem(k, d);
    }
    get(key) {
        const k = this.namespace + key;
        const storageValue = this.store.getItem(k);
        if (storageValue) {
            return (0, KeyValueStore_1.parseValue)(storageValue);
        }
        return undefined;
    }
    remove(key) {
        const k = this.namespace + key;
        this.store.removeItem(k);
    }
    clearAll() {
        const keys = allKeys(this.store, this.namespace);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this.remove(key);
        }
    }
    isEmpty() {
        for (let i = 0; i < this.store.length; i++) {
            const key = this.store.key(i);
            if (key && key.indexOf(this.namespace) === 0) {
                return false;
            }
        }
        return true;
    }
}
exports.LocalStorageKeyValueStore = LocalStorageKeyValueStore;
//# sourceMappingURL=LocalStorageKeyValueStore.js.map