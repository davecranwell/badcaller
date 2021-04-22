"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = void 0;
var config_1 = __importDefault(require("config"));
var serialport_1 = __importDefault(require("serialport"));
var parser_readline_1 = __importDefault(require("@serialport/parser-readline"));
var serialPort = config_1.default.get("serialPort");
var port = new serialport_1.default(serialPort, { autoOpen: false });
var parser = port.pipe(new parser_readline_1.default({ delimiter: "\n" }));
var listen = function (_a) {
    var onOpen = _a.onOpen, onData = _a.onData;
    port.write("AT+VCID=1\r", function (error) {
        if (error) {
            return console.log("Error on write: ", error.message);
        }
        console.log("Enabling CallerId nice");
    });
    port.on("open", onOpen);
    parser.on("data", onData);
};
exports.listen = listen;
