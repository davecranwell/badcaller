"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var lookupNumber_1 = __importDefault(require("./lib/lookupNumber"));
var log = xstate_1.actions.log;
exports.default = (function (io) {
    var serialModemMachine = xstate_1.Machine({
        id: 'serialModem',
        initial: 'idle',
        context: {
            number: undefined,
            rating: undefined,
            timeout: 5,
        },
        states: {
            idle: {
                entry: ['ioUpdate', log('Idle!')],
                on: {
                    RING: 'ringing',
                },
            },
            ringing: {
                initial: 'awaitingNumber',
                entry: ['ioUpdate', log('Ringing!')],
                invoke: {
                    id: 'ringTimeout',
                    src: function (context) { return function (cb) {
                        var timeout = setTimeout(function () {
                            cb('NOT_RINGING');
                        }, 1000 * context.timeout);
                        return function () {
                            clearInterval(timeout);
                        };
                    }; },
                },
                on: {
                    RING: 'ringing',
                    NOT_RINGING: 'idle',
                },
                states: {
                    awaitingNumber: {
                        entry: ['ioUpdate', log('Awaiting number!')],
                        on: {
                            NUMB: {
                                target: 'lookingUp',
                                actions: xstate_1.assign({
                                    number: function (context, event) { return event.val; },
                                }),
                            },
                        },
                    },
                    lookingUp: {
                        entry: ['ioUpdate', log('Looking up!')],
                        invoke: {
                            id: 'lookupNumber',
                            src: function (context, event) { return lookupNumber_1.default(context.number); },
                            onDone: {
                                target: 'success',
                                actions: xstate_1.assign({ rating: function (context, event) { return event.data; } }),
                            },
                            onError: {
                                target: 'failure',
                                actions: xstate_1.assign({ rating: function (context, event) { return event.data; } }),
                            },
                        },
                    },
                    success: {
                        entry: ['ioUpdate', log('Lookup succeeded!')],
                    },
                    failure: {
                        entry: ['ioUpdate', log('Lookup failed!')],
                    },
                },
            },
        },
    }, {
        actions: {
            ioUpdate: function (context, event) {
                io.emit('state', context);
            },
        },
    });
    setTimeout(function () {
        serialModemService.send({ type: 'RING', val: 'bar' });
    }, 2000);
    setTimeout(function () {
        serialModemService.send({ type: 'NUMB', val: '123' });
    }, 4000);
    // setTimeout(() => {
    //   serialModemMService.send('RING')
    // }, 4000)
    // setTimeout(() => {
    //   serialModemMService.send('RING')
    // }, 5000)
    // setTimeout(() => {
    //   serialModemMService.send('RING')
    // }, 6000)
    var serialModemService = xstate_1.interpret(serialModemMachine).start();
    return serialModemService;
});
