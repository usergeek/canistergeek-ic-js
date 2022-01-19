"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeUtils = void 0;
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale("en");
exports.DateTimeUtils = {
    getMomentFromCurrentTime: () => (0, moment_1.default)(),
    getMomentFromCurrentEndOfDay: () => exports.DateTimeUtils.getMomentFromCurrentTime().endOf('day'),
};
//# sourceMappingURL=DateTimeUtils.js.map