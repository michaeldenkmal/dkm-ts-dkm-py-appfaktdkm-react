"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dkm_django_ws_1 = require("../../src/dkm_django/dkm_django_ws");
var rech_form_ws = require("../../src/ws/rech_form_ws");
var IDbConf_1 = require("@at.dkm/dkm-ts-lib-websrvc/lib/IDbConf");
var decimal_js_1 = require("decimal.js");
var DKMFAKT_APPDKMFAKT_CONTEXT = "dkmfakt/appdkmfakt";
var django_root_url = "http://localhost:8080/dkmfakt";
function assert(checkfn, msg) {
    if (checkfn()) {
        console.log("".concat(msg, ": ok"));
    }
    else {
        console.error("".concat(msg, " NICHT OK"));
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var csrftokem, rows, gesamtpreis_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, dkm_django_ws_1.ensureCsrfToken)("http://localhost:8000/dkmfakt")];
                case 1:
                    csrftokem = _b.sent();
                    (0, IDbConf_1.initIDbConf)(document.location.href, "", (_a = {},
                        _a[DKMFAKT_APPDKMFAKT_CONTEXT] = "http://localhost:8000",
                        _a));
                    return [4 /*yield*/, rech_form_ws.rech_form_get_by_vnr(246)];
                case 2:
                    rows = _b.sent();
                    if (rows.rech_row) {
                        console.assert(function () { return (rows.rech_row.verrechnet_am instanceof Date); }, "verrechnet==Date");
                        gesamtpreis_1 = rows.rech_row.gesamtpreis || null;
                        // @ts-ignore
                        console.assert(function () { return (gesamtpreis_1 instanceof decimal_js_1.default); }, "verrechnet==Date");
                    }
                    else {
                        console.error("keine Rechungszeile zurückgeliefert");
                    }
                    console.log(JSON.stringify(rows, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
main();
