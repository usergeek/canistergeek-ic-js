"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyValueStoreFacade = exports.grabLocalStorage = void 0;
const LocalStorageKeyValueStore_1 = require("./LocalStorageKeyValueStore");
const InMemoryKeyValueStore_1 = require("./InMemoryKeyValueStore");
const grabLocalStorage = () => {
    return window.localStorage;
};
exports.grabLocalStorage = grabLocalStorage;
const checkLocalStorage = () => {
    try {
        const storage = (0, exports.grabLocalStorage)();
        const testKey = `ug-ic_test_ls`;
        storage.setItem(testKey, "_");
        storage.removeItem(testKey);
        return true;
    }
    catch (e) {
        return false;
    }
};
const isLocalStorageSupported = checkLocalStorage();
const createStore = (namespace = "ug-ic") => {
    if (isLocalStorageSupported) {
        return new LocalStorageKeyValueStore_1.LocalStorageKeyValueStore(namespace);
    }
    else {
        return new InMemoryKeyValueStore_1.InMemoryKeyValueStore();
    }
};
exports.KeyValueStoreFacade = {
    createStore: createStore,
};
//# sourceMappingURL=KeyValueStoreFacade.js.map