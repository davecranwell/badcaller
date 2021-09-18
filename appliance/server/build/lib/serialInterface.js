"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var serialport_1 = __importDefault(require("serialport"));
var parser_readline_1 = __importDefault(require("@serialport/parser-readline"));
var binding_mock_1 = __importDefault(require("@serialport/binding-mock"));
var logger_1 = __importDefault(require("../logger"));
var logger = logger_1.default('serialInterface');
var portName = config_1.default.get('serialPort');
if (process.env.NODE_ENV === 'development') {
    serialport_1.default.Binding = binding_mock_1.default;
    binding_mock_1.default.createPort(portName, { echo: true, record: true });
    // @ts-ignore
    setTimeout(function () { return serialPort.binding.emitData('\nNMBR=1\n'); }, 500);
}
var serialPort = new serialport_1.default(portName, { autoOpen: false });
var parser = serialPort.pipe(new parser_readline_1.default({ delimiter: '\n' }));
exports.default = (function (_a) {
    var onData = _a.onData;
    serialPort.on('open', function () {
        logger.info("Opened serial port " + portName);
        serialPort.write('AT+VCID=1\r', function (error) {
            if (error) {
                return logger.error('Error on write: ', error.message);
            }
            logger.info('Enabled CallerID');
        });
    });
    parser.on('data', onData);
    return serialPort;
});
