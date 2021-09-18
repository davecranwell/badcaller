"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var logger_1 = __importDefault(require("./logger"));
var logger = logger_1.default('api');
var router = express_1.default.Router();
router.get('/ping', function (req, res) {
    return res;
});
exports.default = router;
