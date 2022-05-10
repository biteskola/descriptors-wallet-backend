"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitcoinRequestBody = exports.BitcoinRequest = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
let BitcoinRequest = class BitcoinRequest {
};
(0, tslib_1.__decorate)([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    (0, tslib_1.__metadata)("design:type", String)
], BitcoinRequest.prototype, "method", void 0);
(0, tslib_1.__decorate)([
    (0, repository_1.property)({
        type: 'array',
        required: true,
        itemType: 'any',
    }),
    (0, tslib_1.__metadata)("design:type", Array)
], BitcoinRequest.prototype, "params", void 0);
BitcoinRequest = (0, tslib_1.__decorate)([
    (0, repository_1.model)()
], BitcoinRequest);
exports.BitcoinRequest = BitcoinRequest;
exports.BitcoinRequestBody = {
    description: 'Request data',
    required: true,
    content: {
        'application/json': {
            schema: (0, rest_1.getModelSchemaRef)(BitcoinRequest),
        },
    },
};
//# sourceMappingURL=bitcoin-controller.specs.js.map