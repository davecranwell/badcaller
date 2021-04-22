"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var pino_1 = __importDefault(require("pino"));
var logger = pino_1.default({
    level: config_1.default.get("loggingLevel"),
    prettyPrint: true,
});
exports.default = (function (name) {
    return logger.child({ name: name });
});
